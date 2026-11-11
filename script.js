// Footer year. Guarded, so a missing element can't kill everything below it.
var yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
} else {
    console.warn("no element with id 'year' found");
}

// Copy-to-clipboard for the email address.
document.querySelectorAll(".copy").forEach(function (button) {
    button.addEventListener("click", function () {
        navigator.clipboard.writeText(button.dataset.copy).then(function () {
            var original = button.textContent;
            button.textContent = "copied";
            setTimeout(function () { button.textContent = original; }, 1500);
        }).catch(function () {
            button.textContent = "press Ctrl+C";
        });
    });
});

// Smooth open/close for the project cards.
(function () {
    var DURATION = 300;
    var EASING = "ease";

    // Respect the visitor's system "reduce motion" setting.
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var cards = document.querySelectorAll("details.project");

    if (cards.length === 0) {
        console.error("no <details class=\"project\"> found - check the HTML class names");
        return;
    }

    cards.forEach(function (details, i) {
        var summary = details.querySelector("summary");
        var body = details.querySelector(".project-body");

        if (!summary) { console.error("card " + i + ": no <summary>"); return; }
        if (!body) { console.error("card " + i + ": no .project-body"); return; }

        var animation = null;

        summary.addEventListener("click", function (event) {
            event.preventDefault();

            if (reduceMotion) {
                details.open = !details.open;
                return;
            }

            var startHeight = details.open ? body.getBoundingClientRect().height : 0;

            if (animation) {
                animation.cancel();
                animation = null;
            }

            var opening = !details.open;
            if (opening) {
                details.open = true;
            }

            var endHeight = opening ? body.scrollHeight : 0;

            animation = body.animate(
                { height: [startHeight + "px", endHeight + "px"] },
                { duration: DURATION, easing: EASING }
            );

            animation.onfinish = function () {
                if (!opening) {
                    details.open = false;
                }
                animation = null;
            };
        });
    });
})();