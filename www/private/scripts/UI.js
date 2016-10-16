$('html').click(()=>{
    $('#slidemenu').removeClass('open')
    $('#registerOverlay').removeClass('open')
    $('#loginOverlay').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#slidemenu').click((event)=>{
    event.stopPropagation();
})

$('#slidemenu').on('click', 'li', (event)=>{
    event.stopPropagation();
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#conversationDraw').on('click', (event)=>{
    $('#conversationDraw').toggleClass('open')
})

$('#conversationDraw').on('click', 'li', (event)=>{
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#header').on('click', 'i', (event)=>{
    event.stopPropagation();
    $('#slidemenu').addClass('open')
})

$('#registerOverlay').on('click', '.panel', (event)=>{
    event.stopPropagation();
})

$('#loginOverlay').on('click', '.panel', (event)=>{
    event.stopPropagation();
})

$('.loggedout').on('click', (event)=>{
    event.stopPropagation();
    $('#loginOverlay').addClass('open')
})

$('#loginOverlay').on('click', '.registerButton',(event)=>{
    $('#loginOverlay').removeClass('open')
    $('#registerOverlay').addClass('open')
})