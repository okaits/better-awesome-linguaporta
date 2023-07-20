setTimeout = (func, second) => {
    window.setTimeout2 = setTimeout;
    console.log("used setTimeout")
    setTimeout2(func, second / 10);
}