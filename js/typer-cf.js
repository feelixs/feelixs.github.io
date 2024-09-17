window.onload = function() {
    var text = document.getElementById('typed').textContent;
    document.getElementById('typed').textContent = '';
    var i = 0;

    function typeWriter() {
        if (i < text.length) {
            document.getElementById('typed').textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        } else {
            document.getElementById('cursor').style.display = 'none';
        }
    }

    setTimeout(typeWriter, 500);
}
