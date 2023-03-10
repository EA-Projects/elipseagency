$(window).on('load', function(){
  // REMOVE PRELOADER
  $("body").removeClass("loading");
  $(".preloader").fadeOut(1000);

  // SCROLL BETWEEN SECTIONS
  // const sections = [...document.querySelectorAll("section")];

  // let options = {
  //   rootMargin: "0px",
  //   threshold: 0.95,
  // }; 

  // const callback = (entries, observer) => {
  //   entries.forEach((entry) => {
  //     const { target } = entry;

  //     if (entry.intersectionRatio >= 0.95) {
  //       target.classList.add("is-visible");
  //     } else {
  //       target.classList.remove("is-visible");
  //     }
  //   });
  // };

  // const observer = new IntersectionObserver(callback, options);

  // sections.forEach((section, index) => {
  //   // const sectionChildren = [...section.querySelector("[data-content]").children];

  //   // sectionChildren.forEach((el, index) => {
  //   //   el.style.setProperty("--delay", `${index * 250}ms`);
  //   // });

  //   observer.observe(section);
  // }); 


  // INIT WOW JS
  wow = new WOW({
    boxClass: 'animate',
    animateClass: 'animated',
    offset: 200,
    mobile: true,
  });
  wow.init();

  // NAV LINK HOVER
  let typeSplit = new SplitType(".nav-link", {
      types: "words, chars",
      tagName: "span"
    });
    
    function getRandomLetter(length) {
      var result = "";
      var characters = "AbcDefghiJklmnOpqrstUvwxYz";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    $(".char").each(function (index) {
      let text = $(this).text();
      $(this).attr("letter", text);
    });
    
    $(".nav-item").each(function (index) {
      function resetText() {
        if (myInterval !== undefined) {
          clearInterval(myInterval);
        }
        chars.each(function (index) {
          let letter = $(this).attr("letter");
          $(this).text(letter);
        });
      }
    
      let myInterval;
      let chars = $(this).find(".char");
      $(this).on("mouseenter", function () {
        let length = chars.length;
        myInterval = setInterval(function () {
          chars.each(function (index) {
            if (index < length) {
              let letter = getRandomLetter(1);
              $(this).text(letter);
            } else {
              let letter = $(this).attr("letter");
              $(this).text(letter);
            }
          });
          length = length - 1;
        }, 100);
        setTimeout(() => {
          resetText();
        }, 600);
      });
      $(this).on("mouseleave", function () {
        resetText();
      });
    });
});

// MARQUEE POWER-UP
window.addEventListener("DOMContentLoaded", (event) => {
    // attribute value checker
    function attr(defaultVal, attrVal) {
      const defaultValType = typeof defaultVal;
      if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
      if (attrVal === "true" && defaultValType === "boolean") return true;
      if (attrVal === "false" && defaultValType === "boolean") return false;
      if (isNaN(attrVal) && defaultValType === "string") return attrVal;
      if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
      return defaultVal;
    }
    // marquee component
    $("[tr-marquee-element='component']").each(function (index) {
      let componentEl = $(this),
        panelEl = componentEl.find("[tr-marquee-element='panel']"),
        triggerHoverEl = componentEl.find("[tr-marquee-element='triggerhover']"),
        triggerClickEl = componentEl.find("[tr-marquee-element='triggerclick']");
      let speedSetting = attr(100, componentEl.attr("tr-marquee-speed")),
        verticalSetting = attr(false, componentEl.attr("tr-marquee-vertical")),
        reverseSetting = attr(false, componentEl.attr("tr-marquee-reverse")),
        scrollDirectionSetting = attr(false, componentEl.attr("tr-marquee-scrolldirection")),
        scrollScrubSetting = attr(false, componentEl.attr("tr-marquee-scrollscrub")),
        moveDistanceSetting = -100,
        timeScaleSetting = 1,
        pausedStateSetting = false;
      if (reverseSetting) moveDistanceSetting = 100;
      let marqueeTimeline = gsap.timeline({ repeat: -1, onReverseComplete: () => marqueeTimeline.progress(1) });
      if (verticalSetting) {
        speedSetting = panelEl.first().height() / speedSetting;
        marqueeTimeline.fromTo(panelEl, { yPercent: 0 }, { yPercent: moveDistanceSetting, ease: "none", duration: speedSetting });
      } else {
        speedSetting = panelEl.first().width() / speedSetting;
        marqueeTimeline.fromTo(panelEl, { xPercent: 0 }, { xPercent: moveDistanceSetting, ease: "none", duration: speedSetting });
      }
      let scrubObject = { value: 1 };
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!pausedStateSetting) {
            if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
              timeScaleSetting = self.direction;
              marqueeTimeline.timeScale(self.direction);
            }
            if (scrollScrubSetting) {
              let v = self.getVelocity() * 0.006;
              v = gsap.utils.clamp(-60, 60, v);
              let scrubTimeline = gsap.timeline({ onUpdate: () => marqueeTimeline.timeScale(scrubObject.value) });
              scrubTimeline.fromTo(scrubObject, { value: v }, { value: timeScaleSetting, duration: 0.5 });
            }
          }
        }
      });
      function pauseMarquee(isPausing) {
        pausedStateSetting = isPausing;
        let pauseObject = { value: 1 };
        let pauseTimeline = gsap.timeline({ onUpdate: () => marqueeTimeline.timeScale(pauseObject.value) });
        if (isPausing) {
          pauseTimeline.fromTo(pauseObject, { value: timeScaleSetting }, { value: 0, duration: 0.5 });
          triggerClickEl.addClass("is-paused");
        } else {
          pauseTimeline.fromTo(pauseObject, { value: 0 }, { value: timeScaleSetting, duration: 0.5 });
          triggerClickEl.removeClass("is-paused");
        }
      }
      if (window.matchMedia("(pointer: fine)").matches) {
        triggerHoverEl.on("mouseenter", () => pauseMarquee(true));
        triggerHoverEl.on("mouseleave", () => pauseMarquee(false));
      }
    });
  });
// NAVIGATION CHANGE
const options = {
  rootMargin: "0px",
  threshold: buildThresholdList()
};

function buildThresholdList() {
  let thresholds = [];
  let numSteps = 10;

  for (let i=1.0; i<=numSteps; i++) {
    let ratio = i/numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

// ADD DATA ATTRIBUTE TO NAVIGATION ON SCROLL

let colorChangeCallback = entries => {
  const header = document.querySelector("header");
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      let sectionColor = entry.target.getAttribute("data-background");
      let viewport = window.innerHeight;
      let visibleHeight = entry.intersectionRect.height;
      if (visibleHeight / viewport >= 0.90) {
        // console.log(entry.target)
        //intersection ratio bigger than 90%
        //-> set header according to target
        header.setAttribute("data-nav-color", sectionColor);
      } else {
        //-> check if element is coming from top or from bottom into view
        if (entry.target.getBoundingClientRect().top < 0) {
          header.setAttribute("data-nav-color", sectionColor);
        }
      }
    }
  });
};

let colorObserver = new IntersectionObserver(colorChangeCallback, options);

document.querySelectorAll("section").forEach(section => {
  colorObserver.observe(section);
  // colorObserver.root.style.border = "2px solid #44aa44";
});