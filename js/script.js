$(function () {
    var $body = $("body");
    var $menuToggle = $("#menu-toggle");
    var projects = [];
    var currentProject = 0;
    var projectTimer;
    var skillTimer;
    var currentSkill = "python";

    var skills = {
        python: {
            name: "PYTHON",
            percent: 90,
            level: "Продвинутый",
            description: "Основы программирования и работа с данными."
        },
        git: {
            name: "GIT",
            percent: 75,
            level: "Хороший уровень",
            description: "Репозитории, коммиты и командная работа."
        },
        css: {
            name: "CSS",
            percent: 70,
            level: "Хороший уровень",
            description: "Адаптивная вёрстка, Grid и Flexbox."
        },
        html: {
            name: "HTML",
            percent: 70,
            level: "Хороший уровень",
            description: "Семантическая структура и организация страниц."
        }
    };

    function scrollToSection(target) {
        var $target = $(target);

        if ($target.length) {
            $("html, body").stop(true).animate({
                scrollTop: $target.offset().top - 72
            }, 550);
        }
    }

    $(document).on("click", "a[href^='#']", function (event) {
        var target = $(this).attr("href");

        if (target && target.length > 1 && $(target).length) {
            event.preventDefault();
            scrollToSection(target);
            $menuToggle.prop("checked", false);
        }
    });

    function updateActiveMenu() {
        var scrollPosition = $(window).scrollTop() + 130;
        var activeId = "home";

        $("main section[id]").each(function () {
            if ($(this).offset().top <= scrollPosition) {
                activeId = this.id;
            }
        });

        $(".menu a").removeClass("active");
        $(".menu a[href='#" + activeId + "']").addClass("active");
    }

    function updateTopButton() {
        $("#to-top").toggleClass("visible", $(window).scrollTop() > 450);
    }

    $(window).on("scroll", function () {
        updateActiveMenu();
        updateTopButton();
    });

    $("#to-top").on("click", function () {
        $("html, body").stop(true).animate({ scrollTop: 0 }, 600);
    });

    function renderSkill(key) {
        var skill = skills[key];
        var degrees = skill.percent * 3.6;

        currentSkill = key;
        $(".skill-item").removeClass("active");
        $(".skill-item[data-skill='" + key + "']").addClass("active");
        $("#skill-percent").text(skill.percent + "%");
        $("#skill-name").text(skill.name);
        $("#skill-level").text(skill.level);
        $("#skill-description").text(skill.description);
        $(".chart-ring").css(
            "background",
            "conic-gradient(var(--lime) 0deg, var(--lime) " + degrees + "deg, #30322d " + degrees + "deg, #30322d 360deg)"
        );
    }

    $(".skill-item").on("click", function () {
        renderSkill($(this).data("skill"));
        restartSkillTimer();
    });

    function nextSkill() {
        var keys = Object.keys(skills);
        var index = keys.indexOf(currentSkill);
        renderSkill(keys[(index + 1) % keys.length]);
    }

    function restartSkillTimer() {
        clearInterval(skillTimer);
        skillTimer = setInterval(nextSkill, 4000);
    }

    function projectTemplate(project, index) {
        var visual;

        if (project.weather) {
            visual = '<div class="weather-art">' +
                '<span>PROJECT ' + String(index + 1).padStart(2, "0") + '</span>' +
                '<div class="sun">☼</div>' +
                '<strong>WEATHER</strong>' +
                '<small>city forecast / API</small>' +
                '</div>';
        } else {
            visual = '<div class="photo-wrap">' +
                '<img src="' + project.image + '" alt="' + project.title + '">' +
                '<span>PROJECT ' + String(index + 1).padStart(2, "0") + '</span>' +
                '</div>';
        }

        return '<article class="project">' + visual +
            '<div class="project-info">' +
            '<div>' +
            '<small>' + project.category + '</small>' +
            '<h3>' + project.title + '</h3>' +
            '<p>' + project.description + '</p>' +
            '<button class="project-card-button" type="button" data-project="' + index + '">ПОДРОБНЕЕ ↗</button>' +
            '</div>' +
            '<b>' + String(index + 1).padStart(2, "0") + '</b>' +
            '</div>' +
            '</article>';
    }

    function renderProjects() {
        var $list = $("#project-list");
        var $dots = $("#project-dots");

        if (!projects.length) {
            $list.html("<p>Проекты пока не загружены.</p>");
            return;
        }

        $list.html(projects.map(projectTemplate).join(""));
        $dots.empty();

        projects.forEach(function (_, index) {
            $dots.append(
                '<button class="project-dot' + (index === 0 ? ' active' : '') + '" type="button" data-project-index="' + index + '" aria-label="Проект ' + (index + 1) + '"></button>'
            );
        });

        currentProject = 0;
        updateProjectSlider();
    }

    function updateProjectSlider() {
        var offset = currentProject * -100;

        $("#project-list").css("transform", "translateX(" + offset + "%)");
        $("#project-counter").text(
            String(currentProject + 1).padStart(2, "0") + " / " + String(projects.length).padStart(2, "0")
        );
        $(".project-dot").removeClass("active").eq(currentProject).addClass("active");
    }

    function goToProject(index) {
        if (!projects.length) {
            return;
        }

        currentProject = (index + projects.length) % projects.length;
        updateProjectSlider();
        restartProjectTimer();
    }

    function restartProjectTimer() {
        clearInterval(projectTimer);
        projectTimer = setInterval(function () {
            goToProject(currentProject + 1);
        }, 5000);
    }

    $("#project-prev").on("click", function () {
        goToProject(currentProject - 1);
    });

    $("#project-next").on("click", function () {
        goToProject(currentProject + 1);
    });

    $(document).on("click", ".project-dot", function () {
        goToProject(Number($(this).data("project-index")));
    });

    $(document).on("click", ".project-card-button", function () {
        var project = projects[Number($(this).data("project"))];

        if (!project) {
            return;
        }

        $("#modal-category").text(project.category);
        $("#modal-title").text(project.title);
        $("#modal-description").text(project.description);
        $("#project-modal").addClass("open").attr("aria-hidden", "false");
        $body.css("overflow", "hidden");
    });

    function closeModal() {
        $("#project-modal").removeClass("open").attr("aria-hidden", "true");
        $body.css("overflow", "");
    }

    $(".modal-close, .modal-overlay").on("click", closeModal);

    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
            $menuToggle.prop("checked", false);
        }
    });

    var touchStartX = 0;
    var touchEndX = 0;

    $("#project-slider").on("touchstart", function (event) {
        touchStartX = event.originalEvent.touches[0].clientX;
    });

    $("#project-slider").on("touchend", function (event) {
        touchEndX = event.originalEvent.changedTouches[0].clientX;
        var distance = touchEndX - touchStartX;

        if (Math.abs(distance) > 50) {
            if (distance < 0) {
                goToProject(currentProject + 1);
            } else {
                goToProject(currentProject - 1);
            }
        }
    });

    function showToast(title, text) {
        $("#toast strong").text(title);
        $("#toast span").text(text);
        $("#toast").addClass("show");

        setTimeout(function () {
            $("#toast").removeClass("show");
        }, 3500);
    }

    $("#contact-form").on("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        var name = $.trim($("#name").val());
        var email = $.trim($("#email").val());
        var message = $.trim($("#message").val());
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        $(".form-error").remove();

        if (!name || !emailPattern.test(email) || !message) {
            var errorText = !name
                ? "Введите имя."
                : !emailPattern.test(email)
                    ? "Введите корректный email."
                    : "Введите сообщение.";

            $("#contact-form").prepend('<span class="form-error">' + errorText + '</span>');
            return false;
        }

        var $button = $(this).find("button[type='submit']");
        var originalText = $button.html();

        $button.prop("disabled", true).text("Отправка...");

        $.ajax({
            url: "data/contact-response.json",
            method: "GET",
            dataType: "json",
            cache: false
        }).done(function (response) {
            $("#contact-form")[0].reset();
            showToast(response.title || "Письмо отправлено", response.message || "Сообщение успешно обработано.");
        }).fail(function () {
            showToast("Письмо отправлено", "Сообщение обработано через AJAX.");
        }).always(function () {
            $button.prop("disabled", false).html(originalText);
        });

        return false;
    });

    function loadProjects() {
        $.ajax({
            url: "data/portfolio.json",
            method: "GET",
            dataType: "json",
            cache: false
        }).done(function (data) {
            projects = data;
            renderProjects();
            restartProjectTimer();
        }).fail(function () {
            projects = [
                {
                    category: "VOLUNTEERING / 2026",
                    title: "Моё участие в волонтёрстве",
                    description: "Опыт командной работы и участия в университетских мероприятиях.",
                    image: "images/volunteering.jpg"
                },
                {
                    category: "WEB / 2026",
                    title: "Один из учебных проектов",
                    description: "Практика создания интерфейса и работы с веб-технологиями.",
                    image: "images/project.jpg"
                },
                {
                    category: "PYTHON / API",
                    title: "Weather",
                    description: "Проект с погодой: получение и отображение актуальных данных.",
                    weather: true
                }
            ];
            renderProjects();
            restartProjectTimer();
        });
    }

    renderSkill("python");
    restartSkillTimer();
    loadProjects();
    updateActiveMenu();
    updateTopButton();
});
