$(document).ready(function() {
    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
    });
    $('button.bibtex-toggle').click(function() {
        var panel = document.getElementById(this.getAttribute('aria-controls'));
        if (!panel) return;

        panel.hidden = !panel.hidden;
        this.setAttribute('aria-expanded', String(!panel.hidden));
    });
    $('button.bibtex-copy').click(async function() {
        var panel = this.closest('.bibtex-panel');
        var code = panel && panel.querySelector('code');
        if (!code) return;

        var status = panel.querySelector('.bibtex-copy-status');
        var button = this;
        clearTimeout(button.copyStatusTimeout);
        status.textContent = '';

        try {
            await copyText(code.textContent.trim());
            status.textContent = 'Copied';
        } catch (error) {
            status.textContent = 'Copy failed. Select the citation above to copy it.';
        }

        button.copyStatusTimeout = setTimeout(function() {
            status.textContent = '';
        }, 3000);
    });
    $('a.email').click(function() {
        $(this).parent().parent().parent().find(".email.hidden").toggleClass('open');
    });
    $('a').removeClass('waves-effect waves-light');

    async function copyText(value) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(value);
                return;
            } catch (error) {
                // Try the selection-based fallback below.
            }
        }

        var field = document.createElement('textarea');
        var previousFocus = document.activeElement;
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.focus();
        field.select();

        try {
            if (!document.execCommand('copy')) throw new Error('Could not copy BibTeX');
        } finally {
            field.remove();
            if (previousFocus && previousFocus.focus) previousFocus.focus();
        }
    }
});
