function func1(n1, n2) {
    return n1 + n2;
}

function func2(n1, n2) {
    return n1 + n2;
}

function func3(n1, n2) {
    return n1 + n2;
}

function func4(param, n1, n2) {
    const obj = {
        func1: func1(n1, n2),
        func2: func2(n1, n2),
        func3: func3(n1, n2),
    };

    console.log(obj);
}

func4('func1', 5, 5);
