//Figure
//P-белые пешки
//p-черные 
//R - ладья
//N - конь
//B - слон
//Q - Королева
//K - Король
var map = Array();
var inf = Array();
var att = Array();

var move_color = "white";
var move_from_x;
var move_from_y;
var pawn_attack_x;//координаты битого поля (когда пешка берет на проходе)
var pawn_attack_y;
var move_figure;
var to_figure;
var possible_moves;
var save_pawn_x = -1;
var save_pawn_y = -1;
var save_pawn_figure = " ";
var can_white_castle_left = true;
var can_white_castle_right = true;
var can_black_castle_left = true;
var can_black_castle_right = true;

function init_map()
{
    can_white_castle_left = true;
    can_white_castle_right = true;
    can_black_castle_left = true;
    can_black_castle_right = true;
    map = 
    [ // y=0  y=1
        ["R", "P", " ", " ", " ", " ", "p", "r"], // x=1
        ["N", "P", " ", " ", " ", " ", "p", "n"], // x=2
        ["B", "P", " ", " ", " ", " ", "p", "b"], // x=3
        ["Q", "P", " ", " ", " ", " ", "p", "q"], // x=4
        ["K", "P", " ", " ", " ", " ", "p", "k"], // x=5
        ["B", "P", " ", " ", " ", " ", "p", "b"], // x=6
        ["N", "P", " ", " ", " ", " ", "p", "n"], // x=7
        ["R", "P", " ", " ", " ", " ", "p", "r"] // x=8
    ];
}

function init_inf()
{
    inf = 
    [
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
}

function can_move(sx, sy, dx, dy) //Проверка может ли хходить фигура
{ 
    if (!can_move_from(sx, sy))
        return false;
    if (!can_move_to(dx, dy))
        return false;
    if (!is_correct_move(sx, sy, dx, dy))
        return false;
    if (!is_check_after_move (sx, sy, dx, dy))
        return true;
    return false;
}

function is_check_after_move (sx, sy, dx, dy)// Проверка на шах
{
    move_figure (sx, sy, dx, dy);
    //1) сделать ход
    var check = is_check (move_color);
    back_figure (sx, sy, dx, dy);
    //5) вернуть ход
    return check;
}

function is_check ()
{
    king = find_figure (move_color == "white" ? "K" : "k");
    // 2. если ход белых - будем искать черного короля, чтобы его сьесть
    for (var x = 0; x <= 7; x++)
        for (var y = 0; y <= 7; y++)
            if (get_color (x,y) != move_color)
    // 3. если ход белых перебираем белые фигуры
        if (is_correct_move (x, y, king.x, king.y))
    // 4. может ли фигура сьесть короля
            return true;
    return false;
}

function is_checkmate ()
{
    if (!is_check ()) return false;
    return possible_moves == 0;
}

function is_stalemate ()
{
    if (is_check ()) return false;
    return possible_moves == 0;
}

function find_figure(figure) //Находим координату короля
{
    for (var x =0; x <= 7; x++)
        for (var y =0; y <= 7; y++)
            if (map [x] [y] == figure)         
                return {x:x, y:y};
    return {x:-1, y:-1};
}

function is_correct_move(sx, sy, dx, dy)// шазматные правила
{
    var figure = map[sx][sy];
    if (is_king(figure))
        return is_correct_king_move(sx, sy, dx, dy);
    if (is_queen(figure))
        return is_correct_queen_move(sx, sy, dx, dy);
    if (is_bishop(figure))
        return is_correct_bishop_move(sx, sy, dx, dy);
    if (is_knight(figure))
        return is_correct_knight_move(sx, sy, dx, dy);
    if (is_rook(figure))
        return is_correct_rook_move(sx, sy, dx, dy);
    if (is_pawn(figure))
        return is_correct_pawn_move(sx, sy, dx, dy);
    return false;
}

function is_king(figure) { return figure.toUpperCase() == "K"; }
function is_queen(figure) { return figure.toUpperCase() == "Q"; }
function is_bishop(figure) { return figure.toUpperCase() == "B"; }
function is_knight(figure) { return figure.toUpperCase() == "N"; }
function is_rook(figure) { return figure.toUpperCase() == "R"; }
function is_pawn(figure) { return figure.toUpperCase() == "P"; }

function is_correct_king_move(sx, sy, dx, dy)
{
    if (Math.abs (dx - sx) <= 1 && Math.abs (dy - sy) <= 1)
        return true;
    return can_castle (sx, sy, dx, dy);
}

function can_castle (sx, sy, dx, dy)
{
    var figure = map [sx] [sy];
    if (figure = "K" 
            && sx == 4 && sy == 0
            && dx == 6 && dy == 0) return can_white_cr();
    if (figure = "K" 
            && sx == 4 && sy == 0
            && dx == 2 && dy == 0) return can_white_cl();
    if (figure = "k" 
            && sx == 4 && sy == 7
            && dx == 6 && dy == 7) return can_black_cr();
    if (figure = "k" 
            && sx == 4 && sy == 7
            && dx == 2 && dy == 7) return can_black_cl();
     return false;
}

function can_white_cr()
{
    if (!can_white_castle_right) return false;
    if (is_check()) return false;
    if (is_check_after_move (4, 0, 5, 0)) return false;
    if (!is_empty (5,0)) return false;
    if (!is_empty (6, 0)) return false;
    if (map [7] [0] != 'R') return false;
    return true;
}

function can_white_cl()
{
    if (!can_white_castle_left) return false;
    if (is_check()) return false;
    if (is_check_after_move (4, 0, 3, 0)) return false;
    if (!is_empty (3,0)) return false;
    if (!is_empty (2, 0)) return false;
    if (!is_empty (1, 0)) return false;
    if (map [0] [0] != 'R') return false;
    return true;
}

function can_black_cr()
{
    if (!can_black_castle_right) return false;
    if (is_check()) return false;
    if (is_check_after_move (4, 7, 5, 7)) return false;
    if (!is_empty (5,7)) return false;
    if (!is_empty (6, 7)) return false;
    if (map [7] [7] != 'r') return false;
    return true;
}

function can_black_cl()
{
    if (!can_black_castle_left) return false;
    if (is_check()) return false;
    if (is_check_after_move (4, 7, 3, 7)) return false;
    if (!is_empty (3, 7)) return false;
    if (!is_empty (2, 7)) return false;
    if (!is_empty (1, 7)) return false;
    if (map [0] [7] != 'r') return false;
    return true;
}

function is_correct_line_move(sx, sy, dx, dy, figure)// Проверк на правильность хода
{
    var delta_x = Math.sign(dx - sx);
    var delta_y = Math.sign(dy - sy);
    if (!is_correct_line_delta(delta_x, delta_y, figure))
        return false;
    do
    {
        sx += delta_x;
        sy += delta_y;
        if (sx == dx && sy == dy)
            return true;
    } while (is_empty (sx, sy))
    return false;
}

function is_correct_line_delta(delta_x, delta_y, figure)//Проверка на ферзя, слона, ладью
{
    if (is_rook(figure))
        return is_correct_rook_delta(delta_x, delta_y);
    if (is_queen(figure))
        return is_correct_queen_delta(delta_x, delta_y);
    if (is_bishop(figure))
        return is_correct_bishop_delta(delta_x, delta_y);
    return false;
}

function is_correct_rook_delta(delta_x, delta_y)
{
    return Math.abs(delta_x) + Math.abs(delta_y) == 1;
}

function is_correct_queen_delta(delta_x, delta_y)
{
    return true;
}

function is_correct_bishop_delta(delta_x, delta_y)
{
    return Math.abs(delta_x) + Math.abs(delta_y) == 2;
}

function is_correct_queen_move(sx, sy, dx, dy)
{
    return is_correct_line_move(sx, sy, dx, dy, "Q");
}

function is_correct_bishop_move(sx, sy, dx, dy)
{
    return is_correct_line_move(sx, sy, dx, dy, "B");
}

function is_correct_knight_move(sx, sy, dx, dy)
{//вычисление модуля (из конечной вычитаем начальную) 
    if (Math.abs(dx - sx) == 1 && Math.abs(dy - sy) == 2)
        return true;
    if (Math.abs(dx - sx) == 2 && Math.abs(dy - sy) == 1)
        return true;
    return false;
}

function is_correct_rook_move(sx, sy, dx, dy)
{
    return is_correct_line_move(sx, sy, dx, dy, "R");
}
//Проверка на пустую (свободную) клетку
function is_empty(x, y)
{
    if (!on_map (x, y)) return false;
    return map [x] [y] == " ";
}

function on_map(x, y)
{
    return (x >= 0 && x <= 7 &&
        y >= 0 && y <= 7);
}
//Реализация пешки
function is_correct_pawn_move(sx, sy, dx, dy)
{
    if (sy <1 || sy > 6)
    return false;
    if (get_color (sx, sy) == "white")
        return is_correct_sign_pawn_move (sx, sy, dx, dy, +1);
    if (get_color (sx, sy) == "black")
        return is_correct_sign_pawn_move (sx, sy, dx, dy, -1);
    return false;
}

function is_correct_sign_pawn_move (sx, sy, dx, dy, sign)
{
    if (is_pawn_passant (sx, sy, dx, dy, sign))//Если взятие неа проходе
        return true;
    if (!is_empty (dx, dy))
    { //Это взятие?
        if (Math.abs (dx - sx) != 1) // 1 шаг влево\вправо
            return false;
        return dy - sy == sign;
    }
    if (dx != sx) //
        return false;
    if (dy - sy == sign) //проверка на 1 клетку
        return true;
    if (dy - sy == sign*2)
    {//проверка на 2 клетки
        if (sy != 1 && sy != 6)
                return false;
            return is_empty (sx, sy + sign);
    } 
        return false;
}

function is_pawn_passant (sx, sy, dx, dy, sign)
{
    if (!(dx == pawn_attack_x && dy == pawn_attack_y))
        return false;
    if (sign == +1 && sy !=4)//пешка берет на проходе только с 4 горизонтали 
        return false;
    if (sign == -1 && sy !=3)//пешка берет на проходе только с 3 горизонтали (для черных)
    return false;
    if (dy - sy != sign)
        return false;
    return (Math.abs (dx - sx) == 1);
}

function mark_moves_from()
{
    possible_moves = 0;
    init_inf(); //Скидываем значение матрицы
    for (var sx = 0; sx <= 7; sx++)
        for (var sy = 0; sy <= 7; sy++)
            for (var dx = 0; dx <= 7; dx++)
                for (var dy = 0; dy <= 7; dy++)
                    if (can_move (sx, sy, dx, dy))
                    {
                        inf [sx] [sy] = 1;
                        possible_moves ++;
                    }
}

function mark_moves_to()
{
    init_inf(); //Скидываем значение матрицы
    for (var x = 0; x <= 7; x++)
        for (var y = 0; y <= 7; y++)
            if (can_move (move_from_x, move_from_y, x, y))
                inf [x] [y] = 2;
}
//Пометить клетки с которых можно сделать код
function can_move_from (x, y)
{
    if (!on_map(x, y)) return false;
    return get_color (x, y) == move_color;
}

function can_move_to (x, y)
{
    if (!on_map (x, y)) return false;
    if (map [x] [y] == " ")
        return true;
    return get_color(x, y) != move_color; //white cat goes to black
}
//Определяем цвт фигуры
function get_color(x, y)
{
    var figure = map [x] [y];
    if (figure == " ")
        return "";
    return (figure.toUpperCase() == figure) ? "white" : "black";
}

function click_box(x, y)
{
    if (inf [x] [y] == "1")
        click_box_from (x, y);
    if (inf [x] [y] == "2")
        click_box_to(x, y);
}

function click_box_from(x, y)
{
    move_from_x = x;
    move_from_y = y;
    mark_moves_to();
    show_map();
}

function move_figure (sx, sy, dx, dy)
{
    from_figure = map [sx] [sy];
    to_figure = map [dx] [dy];
    map [dx] [dy] = from_figure;
    map [sx] [sy] = " ";
    move_pawn_attack (from_figure, dx, dy);
}

function back_figure(sx, sy, dx, dy)
{
    map [sx] [sy] = from_figure;
    map [dx] [dy] = to_figure;
    back_pawn_attack ();
}
//до хода
function click_box_to (to_x, to_y)
{
    move_figure (move_from_x, move_from_y, to_x, to_y);

    promote_pawn (from_figure, to_x, to_y);
    check_pawn_attack (from_figure, to_x, to_y);

    update_castle_flags (move_from_x, move_from_y, to_x, to_y);
    move_castling_rook (move_from_x, move_from_y, to_x, to_y);

    turn_move();
    mark_moves_from();
    show_map();
}

function update_castle_flags (from_x, from_y, to_x, to_y)
{
     var figure = map [to_x] [to_y];
    if (figure == "K")
    {
        can_white_castle_left = false;
        can_white_castle_right = false;
    }

    if (figure == "k")
    {
        can_black_castle_left = false;
        can_black_castle_right = false;
    }

    if (figure == "R" && from_x == 0 && from_y == 0)
        can_white_castle_left = false;
    if (figure == "R" && from_x == 7 && from_y == 0)
        can_white_castle_right = false;

    if (figure == "r" && from_x == 0 && from_y == 7)
        can_black_castle_left = false;
    if (figure == "r" && from_x == 7 && from_y == 7)
        can_black_castle_right = false;
}
//помещении ладьи при рокировке
function move_castling_rook (from_x, from_y, to_x, to_y)
{
    if (!is_king (map [to_x] [to_y])) return;

    if (Math.abs (to_x - from_x) != 2) return;

    if (to_x == 6 && to_y == 0) { map [7] [0] = ' '; map [5] [0] = 'R'; }
    if (to_x == 2 && to_y == 0) { map [0] [0] = ' '; map [3] [0] = 'R'; }
    if (to_x == 6 && to_y == 7) { map [7] [7] = ' '; map [5] [7] = 'r'; }
    if (to_x == 2 && to_y == 7) { map [0] [7] = ' '; map [3] [7] = 'r'; }
}

//Превращение пешки
function promote_pawn (from_figure, to_x, to_y)
{
    if (!is_pawn (from_figure))
        return;
    if (!(to_y == 7 || to_y == 0))
        return;
    do {
        figure = prompt ("Select figure to promote: Q R B N", "Q"); while (figure === null || figure === ""){ figure = prompt ("Select figure to promote: Q R B N", "Q"); }
    } while (!(
            is_queen (figure) ||
            is_rook (figure) ||
            is_bishop (figure) ||
            is_knight (figure)));
        if (move_color == "white") 
            figure = figure.toUpperCase();
        else
            figure = figure.toLowerCase();
        map [to_x] [to_y] = figure;
}
//функция выполняется после хода
function move_pawn_attack (from_figure, to_x, to_y)
{    
    if (is_pawn (from_figure))
    if (to_x == pawn_attack_x && to_y == pawn_attack_y)
    {
        var y = move_color == "white" ? to_y -1 : to_y +1;
        save_pawn_figure = map [to_x] [y];
        save_pawn_x = to_x;
        save_pawn_y = y;
        map [to_x] [y] = " ";
    }
}
    
function back_pawn_attack ()
{    
    if (save_pawn_x == -1) return;
    map [save_pawn_x] [save_pawn_y] = save_pawn_figure;
}
     
function check_pawn_attack (from_figure, to_x, to_y)
            {                 
    pawn_attack_x = -1;
    pawn_attack_y = -1;
    save_pawn_x = -1;
    if (is_pawn (from_figure))
        if (Math.abs (to_y - move_from_y))
        {
            pawn_attack_x = move_from_x;
            pawn_attack_y = (move_from_y + to_y) / 2;
        }
}

function turn_move()
{
   move_color = move_color == "white" ? "black" : "white";
}
//HTML Figure
function figure_to_html(figure)
{
    switch (figure)
    {
        case "K": return "&#9812;"; case "k":return "&#9818;";
        case "Q":return "&#9813;";case "q":return "&#9819;";
        case "R":return "&#9814;";case "r":return "&#9820;";
        case "B":return "&#9815;";case "b":return "&#9821;";
        case "N":return "&#9816;";case "n":return "&#9822;";
        case "P":return "&#9817;";case "p":return "&#9823;";
        default: return "&nbsp;";
    }
}
//Board
function show_map()
{
    html = "<table border='1' cellpadding='2' cellspacing='0'>";
    for (var y = 7; y >= 0; y--)
    {
        html += "<tr>";
        html += "<td>&nbsp;" + y + "&nbsp;</td>"
        for (var x = 0; x <= 7; x++)
        {
            if (inf [x] [y] == " "){
                brColor = (x + y) % 2 ? "#eeffee" : "grey";
                brWidth = "3px";
            } else {
                brColor = inf [x] [y] == "1" ? "#aaFFaa" : "#FFaaaa";
                brWidth = "3px";
            }
            color = (x + y) % 2 ? "white" : "grey";
            html += "<td style='height: 50px; width: 50px; " +
                "background-color: " + color + ";text-align:center;" +
                "font-size:36px;" +
                " border-color: " + brColor +"; " +
                " border-width: " + brWidth +"; " +
                "color: #000000; " +
                
                "'onclick='click_box(" + x + ", " + y + ");'>";
            html += figure_to_html(map[x] [y]);
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "<tr>";
    html += "<td>&nbsp;</td>"
    for (var x = 0; x <= 7; x++)
        html += "<td style='text-align:center'>" + x + "</td>"
    document.getElementById("board").innerHTML = html;
    show_info ();
}

function show_info ()
{
    var html = "Turns: " + move_color;
    if (is_checkmate ())
        html += " CHECKMATE";
    else
    if (is_stalemate ())
        html += " STALEMATE";
    else
    if (is_check ())
        html += " CHECK"
    html +=
        (can_white_castle_left ? ' WCL ' : '') +
        (can_white_castle_right ? ' WCR ' : '') +
        (can_black_castle_left ? ' bCL ' : '') +
        (can_black_castle_right ? ' bCR ' : '');
    document.getElementById("info").innerHTML = html;
}

function start()
{
    init_map();
    mark_moves_from();
    show_map();
}

start();
//script
