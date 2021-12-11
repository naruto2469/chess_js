var map = Array();
var inf = Array();
var move_color = "white";
var move_from_x;
var move_from_y;
var pawn_attack_x;//координаты битого поля (когда пешка берет на проходе)
var pawn_attack_y;
var move_figure;
var to_figure;
//Figure
//P-белые пешки
//p-черные 
//R - ладья
//N - конь
//B - слон
//Q - Королева
//K - Король


function init_map() {
    map = [ // y=0  y=1
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

function init_inf() {
    inf = [
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

//Проверка может ли хходить фигура
function can_move(sx, sy, dx, dy) {
    if (!can_move_from(sx, sy))
        return false;
    if (!can_move_to(dx, dy))
        return false;
    if (!is_correct_move(sx, sy, dx, dy))
        return false;
    if (!is_check(sx, sy, dx, dy))
        return true;
    return false;

}

// Проверка на шах
function is_check (sx, sy, dx, dy){

    move_figure (sx, sy, dx, dy);
    //1) сделать ход
    king = find_figure (move_color == "white" ? "K" : "k");
    //map [king.x] [king.y] = "P";
    //2) найти короля
    turn_move();
    //Передать ход
    var can_be_eaten = false;
    for (var x =0; x <= 7; x++)
        for (var y =0; y <= 7; y++)
            if (get_color (x, y) == move_color)
    //3) перебрать фигируы
        if (is_correct_move(x, y, king.x, king.y))
    //4) проверть может ли она сьесть короля
        can_be_eaten = true;

    turn_move();
    //вернуть ход
    
  
    back_figure (sx, sy, dx, dy);
    //5) вернуть ход
    return can_be_eaten;
}
 //Находим координату короля
function find_figure(figure){
    for (var x =0; x <= 7; x++)
        for (var y =0; y <= 7; y++)
            if (map [x] [y] == figure)
                
    return {x:x, y:y};
    return {x:-1, y:-1};
}

// шазматные правила
function is_correct_move(sx, sy, dx, dy) {
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

function is_king(figure) {
    return figure.toUpperCase() == "K";
}

function is_queen(figure) {
    return figure.toUpperCase() == "Q";
}

function is_bishop(figure) {
    return figure.toUpperCase() == "B";
}

function is_knight(figure) {
    return figure.toUpperCase() == "N";
}

function is_rook(figure) {
    return figure.toUpperCase() == "R";
}

function is_pawn(figure) {
    return figure.toUpperCase() == "P";
}

function is_correct_king_move(sx, sy, dx, dy) {
    if (Math.abs(dx - sx) <= 1 && Math.abs(dy - sy) <= 1)
        return true;
    return false;
}

// Проверк на правильность хода 
function is_correct_line_move(sx, sy, dx, dy, figure) {
    var delta_x = Math.sign(dx - sx);
    var delta_y = Math.sign(dy - sy);

    if (!is_correct_line_delta(delta_x, delta_y, figure))
        return false;
    do {
        sx += delta_x;
        sy += delta_y;
        if (sx == dx && sy == dy)
            return true;
    } while (is_empty(sx, sy))

    return false;
}

//Проверка на ферзя, слона, ладью
function is_correct_line_delta(delta_x, delta_y, figure) {
    if (is_rook(figure))
        return is_correct_rook_delta(delta_x, delta_y);
    if (is_queen(figure))
        return is_correct_queen_delta(delta_x, delta_y);
    if (is_bishop(figure))
        return is_correct_bishop_delta(delta_x, delta_y);
    return false;
}

function is_correct_rook_delta(delta_x, delta_y) {
    return Math.abs(delta_x) + Math.abs(delta_y) == 1;
}

function is_correct_queen_delta(delta_x, delta_y) {
    return true;
}

function is_correct_bishop_delta(delta_x, delta_y) {
    return Math.abs(delta_x) + Math.abs(delta_y) == 2;
}

function is_correct_queen_move(sx, sy, dx, dy) {
    return is_correct_line_move(sx, sy, dx, dy, "Q");
}

function is_correct_bishop_move(sx, sy, dx, dy) {
    return is_correct_line_move(sx, sy, dx, dy, "B");
}

function is_correct_knight_move(sx, sy, dx, dy) {
    //вычисление модуля (из конечной вычитаем начальную) 
    if (Math.abs(dx - sx) == 1 && Math.abs(dy - sy) == 2)
        return true;
    if (Math.abs(dx - sx) == 2 && Math.abs(dy - sy) == 1)
        return true;
    return false;
}

function is_correct_rook_move(sx, sy, dx, dy) {
    return is_correct_line_move(sx, sy, dx, dy, "R");
}
//Проверка на пустую (свободную) клетку
function is_empty(x, y) {
    if (!on_map(x, y)) return false;
    return map[x][y] == " ";
}

function on_map(x, y) {
    return (x >= 0 && x <= 7 &&
        y >= 0 && y <= 7);
}
//Реализация пешки
function is_correct_pawn_move(sx, sy, dx, dy) {
    if (sy <1 || sy > 6)
    return false;
    if (get_color (sx, sy) == "white")
        return is_correct_sign_pawn_move (sx, sy, dx, dy, +1);
    if (get_color (sx, sy) == "black")
        return is_correct_sign_pawn_move (sx, sy, dx, dy, -1);
    return false;
}

function is_correct_sign_pawn_move (sx, sy, dx, dy, sign){

    if (is_pawn_passant (sx, sy, dx, dy, sign))//Если взятие неа проходе
        return true;
    if (!is_empty (dx, dy)){ //Это взятие?
        if (Math.abs (dx - sx) != 1) // 1 шаг влево\вправо
            return false;
        return dy -sy == sign;
    }
    if (dx != sx) //
        return false;

    if (dy - sy == sign) //проверка на 1 клетку
        return true;

    if (dy - sy == sign*2){//проверка на 2 клетки
        if (sy != 1 && sy != 6)
                return false;
            return is_empty (sx, sy + sign);
    } 
        return false;
}

function is_pawn_passant (sx, sy, dx, dy, sign){
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

function mark_moves_to() {
    init_inf(); //Скидываем значение матрицы
    for (var x = 0; x <= 7; x++)
        for (var y = 0; y <= 7; y++)
            if (can_move(move_from_x, move_from_y, x, y))
                inf[x][y] = 2;
}
//Пометить клетки с которых можно сделать код




function can_move_from(x, y) {
    if (!on_map(x, y)) return false;
    return get_color(x, y) == move_color;
}

function can_move_to(x, y) {
    if (!on_map(x, y)) return false;
    if (map[x][y] == " ")
        return true;
    return get_color(x, y) != move_color; //white cat goes to black
}

//Определяем цвт фигуры
function get_color(x, y) {
    var figure = map[x][y];
    if (figure == " ")
        return "";
    return (figure.toUpperCase() == figure) ? "white" : "black";
}

function click_box(x, y) {
    //alert (x + "" + y);
    if (inf[x][y] == "1")
        click_box_from(x, y);
    if (inf[x][y] == "2")
        click_box_to(x, y);
}

function click_box_from(x, y) {
    move_from_x = x;
    move_from_y = y;
    mark_moves_to();
    show_map();
}

function move_figure (sx, sy, dx, dy){
    from_figure = map[sx][sy];
    to_figure = map [dx][dy];
    map[dx][dy] = from_figure;
    map[sx][sy] = " ";
}

function back_figure(sx, sy, dx, dy){
    map [sx] [sy] = from_figure;
    map [dx] [dy] = to_figure;
}

//до хода
function click_box_to(to_x, to_y) {
  
move_figure(move_from_x, move_from_y, to_x, to_y);
   promote_pawn (from_figure, to_x, to_y);
   


    

   
    check_pawn_attack (from_figure, to_x, to_y);
    turn_move();
    mark_move_from();
    show_map();
}
//Превращение пешки
function promote_pawn (from_figure, to_x, to_y){
    if (!is_pawn (from_figure))
        return " ";
    if (!(to_y ==7 || to_y == 0))
    return;
    do {
        figure = prompt ("Select figure to promote: Q R B N", "Q");
        while (figure === null || figure === ""){
            figure = prompt ("Select figure to promote: Q R B N", "Q");
        }
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
function check_pawn_attack (from_figure, to_x, to_y){
    
    if (is_pawn (from_figure))
    if (to_x == pawn_attack_x && to_y == pawn_attack_y)
        if (move_color == "white")
            map [to_x] [to_y -1] = " ";// white
        else
        map [to_x] [to_y +1] = " ";// black
        

    pawn_attack_x = -1;
    pawn_attack_y = -1;
    if (is_pawn (from_figure))
        if (Math.abs (to_y - move_from_y)){
            pawn_attack_x = move_from_x;
            pawn_attack_y = (move_from_y + to_y) / 2;
        }
}

function turn_move() {
    if (move_color == "white")
        move_color = "black";
    else
        move_color = "white";
}

//HTML Figure
function figure_to_html(figure) {
    switch (figure) {
        case "K":
            return "&#9812;";
        case "k":
            return "&#9818;";
        case "Q":
            return "&#9813;";
        case "q":
            return "&#9819;";
        case "R":
            return "&#9814;";
        case "r":
            return "&#9820;";
        case "B":
            return "&#9815;";
        case "b":
            return "&#9821;";
        case "N":
            return "&#9816;";
        case "n":
            return "&#9822;";
        case "P":
            return "&#9817;";
        case "p":
            return "&#9823;";
        default:
            return "&nbsp;";
    }
}


//Board
function show_map() {
    html = "<table border='1' cellpadding='2' cellspacing='0'>";
    for (var y = 7; y >= 0; y--) {
        html += "<tr>";
        html += "<td>&nbsp;" + y + "&nbsp;</td>"
        for (var x = 0; x <= 7; x++) {
            if (inf[x][y] == " ")
                color = (x + y) % 2 ? "white" : "grey";
            else
                color = inf[x] [y] == "1" ? "#aaffaa" : "#ffaaaa";

            html += "<td style='height: 50px; width: 50px; " +
                "background-color: " + color + ";text-align:center;" +
                "font-size:40px;" +
                "color: #000000; " +
                "'onclick='click_box(" + x + ", " + y + ");'>";

            html += figure_to_html(map[x][y]);
            html += "</td>";
        }

        html += "</tr>";
    }
    html += "<tr>";
    html += "<td>&nbsp;</td>"
    for (var x = 0; x <= 7; x++) {
        html += "<td style='text-align:center'>" + x + "</td>"
    }
    document.getElementById("board").innerHTML = html;
   // show_info();
}

//function show_info (){
//    var html = "Turns: " + move_color;
//    /*if (is_checkmate())
//        html += " CHECKMATE";
//    else
//    if (is_stalemate ())
//        html += "   STALEMATE";
//    else*/
//    if (is_check ())
//     html += "CHECK";
//
//     document.getElementById("info").innerHTML = html;
//     
//    
//}

function start() {
    init_map();
    mark_move_from();
    show_map();
}
start();