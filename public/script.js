window.onload = function () {
    var converter = new showdown.Converter();
    var mdPad = document.getElementById('md-pad');
    var markdownArea = document.getElementById('markdown');

    // make the tab act like a tab
    mdPad.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = e.target;
            var value = target.value;

            // set textarea value to: text before caret + tab + text after caret
            target.value = value.substring(0, start)
                + "\t"
                + value.substring(end);

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault();
        }
    });

    var previousMarkdownValue;

    // convert text area to markdown html
    var convertTextAreaToMarkdown = function () {
        var markdownText = mdPad.value;
        previousMarkdownValue = markdownText;
        html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;
    };

    var didChangeOccur = function () {
        if (previousMarkdownValue != mdPad.value) {
            return true;
        }
        return false;
    };

    // check every second if the text area has changed
    setInterval(function () {
        if (didChangeOccur()) {
            convertTextAreaToMarkdown();
        }
    }, 1000);

    // convert textarea on input change
    mdPad.addEventListener('input', convertTextAreaToMarkdown);

    // ignore if on home page
    if (document.location.pathname.length > 1) {
        // implement share js
        var documentName = document.location.pathname.substring(1);
        sharejs.open(documentName, 'text', function (error, doc) {
            doc.attach_textarea(mdPad);
            convertTextAreaToMarkdown();
        });
    }

    // convert on page load
    convertTextAreaToMarkdown();
};
