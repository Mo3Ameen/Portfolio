console.log("--- script.js started ---");

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

    // TEMPORARY: set to false later to respect the visitor's system setting.
    var FORCE_ANIMATION = true;

    var systemReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var reduceMotion = FORCE_ANIMATION ? false : systemReduceMotion;

    var cards = document.querySelectorAll("details.project");

    console.log("system reduced-motion setting:", systemReduceMotion);
    console.log("project cards found:", cards.length);

    if (cards.length === 0) {
        console.error("no <details class=\"project\"> found - check the HTML class names");
        return;
    }

    cards.forEach(function (details, i) {
        var summary = details.querySelector("summary");
        var body = details.querySelector(".project-body");

        if (!summary) { console.error("card " + i + ": no <summary>"); return; }
        if (!body) { console.error("card " + i + ": no .project-body"); return; }

        console.log("card " + i + ": wired up");

        var animation = null;

        summary.addEventListener("click", function (event) {
            event.preventDefault();

            if (reduceMotion) {
                console.log("reduced motion - instant toggle");
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

            console.log("click - opening:", opening, "from:", Math.round(startHeight), "to:", endHeight);

            if (endHeight === 0 && opening) {
                console.error("body has zero height - nothing to animate");
            }

            animation = body.animate(
                { height: [startHeight + "px", endHeight + "px"] },
                { duration: DURATION, easing: EASING }
            );

            animation.onfinish = function () {
                if (!opening) {
                    details.open = false;
                }
                animation = null;
                console.log("animation finished");
            };
        });
    });
})();