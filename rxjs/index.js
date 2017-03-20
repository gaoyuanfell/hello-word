// var foo = Rx.Observable.create(function (a) {

// });
// foo.subscribe(function (a) {
//     console.info(a);
// })


// function click() {
//     foo.next(1);
// }


var subject = new Rx.Subject();
subject.subscribe({
    next: function(v){console.log('observerA: ' + v)}
});
subject.subscribe({
    next: function(v){console.log('observerB: ' + v)}
});
subject.next(1);
subject.next(2);