$(function () {
  'use strict';

  const skills = [
    { id: 'python', name: 'Python', percent: 90, level: 'Продвинутый', description: 'Работа с Python и учебными проектами, включая API и обработку данных.' },
    { id: 'git', name: 'Git', percent: 75, level: 'Уверенный', description: 'Ведение истории проекта, ветки, коммиты и работа с GitHub.' },
    { id: 'css', name: 'CSS', percent: 70, level: 'Уверенный', description: 'Адаптивная вёрстка, Flexbox, Grid, анимации и организация стилей.' },
    { id: 'html', name: 'HTML', percent: 70, level: 'Уверенный', description: 'Семантическая структура страниц, формы, доступность и адаптивная разметка.' }
  ];

  let projects = [];
  let currentProject = 0;
  let projectTimer;
  let touchStartX = 0;

  function renderSkills() {
    const list = $('#js-skills-list');
    list.empty();

    $.each(skills, function (_, skill) {
      $('<button>', {
        class: 'skills__item',
        type: 'button',
        'data-skill': skill.id,
        html: '<span class="skills__name">' + skill.name + '</span><span class="skills__percent">' + skill.percent + '%</span>'
      }).appendTo(list);
    });

    updateSkill(skills[0].id);
  }

  function updateSkill(id) {
    const skill = skills.find(function (item) { return item.id === id; }) || skills[0];
    $('.skills__item').removeClass('skills__item--active').filter('[data-skill="' + skill.id + '"]').addClass('skills__item--active');
    $('#js-skill-percent').text(skill.percent + '%');
    $('#js-skill-name').text(skill.name.toUpperCase());
    $('#js-skill-description').text(skill.description);
    $('#js-skill-ring').css('background', 'conic-gradient(var(--color-primary) 0 ' + skill.percent + '%, var(--color-border) ' + skill.percent + '% 100%)');
  }

  function fallbackProjects() {
    return [
      { id: 1, category: 'VOLUNTEERING / 2026', title: 'Моё участие в волонтёрстве', description: 'Опыт командной работы и участия в университетских мероприятиях.', image: 'images/volunteering.jpg' },
      { id: 2, category: 'WEB / 2026', title: 'Учебный web-проект', description: 'Практика создания интерфейса и работы с современными веб-технологиями.', image: 'images/project.jpg' },
      { id: 3, category: 'PYTHON / API', title: 'Weather', description: 'Проект с погодой: получение и отображение актуальных данных через API.', weather: true }
    ];
  }

  function renderProject() {
    if (!projects.length) return;
    const project = projects[currentProject];
    const image = project.image ? '<div class="projects__image-wrap"><img class="projects__image" src="' + project.image + '" alt="' + project.title + '"></div>' : '<div class="projects__image-wrap"><div class="skills__ring"><div class="skills__ring-center"><strong class="skills__value">API</strong><span class="skills__label">PYTHON</span></div></div></div>';
    const html = '<article class="projects__card" data-project-id="' + project.id + '">' + image + '<div class="projects__content"><span class="projects__category">' + project.category + '</span><h3 class="projects__title">' + project.title + '</h3><p class="projects__description">' + project.description + '</p><button class="button button--small button--primary js-project-open" type="button">Подробнее</button></div></article>';

    $('#js-project-list').hide().html(html).fadeIn(220);
    $('#js-project-counter').text(String(currentProject + 1).padStart(2, '0') + ' / ' + String(projects.length).padStart(2, '0'));
    renderDots();
  }

  function renderDots() {
    const dots = $('#js-project-dots').empty();
    $.each(projects, function (index) {
      $('<button>', {
        class: 'projects__dot' + (index === currentProject ? ' projects__dot--active' : ''),
        type: 'button',
        'data-project-index': index,
        'aria-label': 'Проект ' + (index + 1)
      }).appendTo(dots);
    });
  }

  function showProject(index) {
    if (!projects.length) return;
    currentProject = (index + projects.length) % projects.length;
    renderProject();
  }

  function restartProjectTimer() {
    clearInterval(projectTimer);
    projectTimer = setInterval(function () { showProject(currentProject + 1); }, 5000);
  }

  function loadProjects() {
    $.ajax({
      url: 'data/portfolio.json',
      dataType: 'json',
      cache: false,
      timeout: 5000
    }).done(function (data) {
      projects = Array.isArray(data) ? data : fallbackProjects();
      showProject(0);
      restartProjectTimer();
    }).fail(function () {
      projects = fallbackProjects();
      showProject(0);
      restartProjectTimer();
    });
  }

  function showToast() {
    const toast = $('#js-toast');
    toast.addClass('toast--visible');
    setTimeout(function () { toast.removeClass('toast--visible'); }, 3200);
  }

  function validateForm() {
    let valid = true;
    const name = $.trim($('#js-name').val());
    const email = $.trim($('#js-email').val());
    const message = $.trim($('#js-message').val());
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $('.contact__error').text('');
    if (name.length < 2) { $('#js-name-error').text('Введите имя не короче 2 символов.'); valid = false; }
    if (!emailPattern.test(email)) { $('#js-email-error').text('Введите корректный email.'); valid = false; }
    if (message.length < 5) { $('#js-message-error').text('Сообщение должно содержать минимум 5 символов.'); valid = false; }
    return valid;
  }

  function setTheme(theme) {
    $('html').attr('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    $('#js-theme-toggle').text(theme === 'dark' ? '☀' : '☾').attr('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');

  renderSkills();
  loadProjects();

  $('#js-skills-list').on('click', '.skills__item', function () {
    updateSkill($(this).data('skill'));
  });

  $('#js-project-next').on('click', function () { showProject(currentProject + 1); restartProjectTimer(); });
  $('#js-project-prev').on('click', function () { showProject(currentProject - 1); restartProjectTimer(); });
  $('#js-project-dots').on('click', '.projects__dot', function () { showProject(Number($(this).data('project-index'))); restartProjectTimer(); });

  $('#js-project-slider').on('touchstart', function (event) {
    touchStartX = event.originalEvent.touches[0].clientX;
  }).on('touchend', function (event) {
    const touchEndX = event.originalEvent.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 50) {
      showProject(delta < 0 ? currentProject + 1 : currentProject - 1);
      restartProjectTimer();
    }
  });

  $('#js-project-list').on('click', '.js-project-open', function () {
    const project = projects[currentProject];
    $('#js-modal-title').text(project.title);
    $('#js-modal-text').text(project.description);
    $('#js-modal').addClass('modal--open').hide().fadeIn(180);
  });

  function closeModal() { $('#js-modal').fadeOut(180, function () { $(this).removeClass('modal--open'); }); }
  $('#js-modal-close').on('click', closeModal);
  $('#js-modal').on('click', function (event) { if (event.target === this) closeModal(); });
  $(document).on('keydown', function (event) { if (event.key === 'Escape') closeModal(); });

  $('#js-projects-menu').on('click', function () {
    const menu = $('#js-projects-dropdown');
    const isOpen = !menu.prop('hidden');
    menu.prop('hidden', isOpen);
    $(this).attr('aria-expanded', String(!isOpen));
  });

  $('#js-projects-dropdown').on('click', '[data-project-menu]', function () {
    showProject(Number($(this).data('project-menu')));
    restartProjectTimer();
    $('#js-projects-dropdown').prop('hidden', true);
    $('#js-projects-menu').attr('aria-expanded', 'false');
  });

  $('#js-theme-toggle').on('click', function () {
    setTheme($('html').attr('data-theme') === 'dark' ? 'light' : 'dark');
  });

  $('#js-menu-toggle').on('click', function () {
    const menu = $('#js-mobile-menu');
    const isOpen = !menu.prop('hidden');
    menu.prop('hidden', isOpen);
    $(this).attr('aria-expanded', String(!isOpen));
  });

  $(document).on('click', '[data-scroll]', function (event) {
    const target = $(this).attr('href');
    if (!target || target.charAt(0) !== '#') return;
    const element = $(target);
    if (!element.length) return;
    event.preventDefault();
    $('html, body').stop().animate({ scrollTop: element.offset().top - 75 }, 550);
    $('#js-mobile-menu').prop('hidden', true);
    $('#js-menu-toggle').attr('aria-expanded', 'false');
  });

  const sections = $('main section[id]');
  $(window).on('scroll', function () {
    const position = $(window).scrollTop() + 120;
    let active = 'about';
    sections.each(function () {
      if (position >= $(this).offset().top) active = this.id;
    });
    $('.header__link').removeClass('header__link--active').filter('[href="#' + active + '"]').addClass('header__link--active');
    $('#js-back-top').toggleClass('back-top--visible', $(window).scrollTop() > 500);
  });

  $('#js-back-top').on('click', function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 550);
  });

  $('#js-contact-form').on('submit', function (event) {
    event.preventDefault();
    if (!validateForm()) return;

    const button = $('#js-form-submit');
    button.prop('disabled', true).text('Отправка...');

    $.ajax({
      url: 'data/contact-response.json',
      dataType: 'json',
      method: 'GET',
      cache: false,
      timeout: 5000
    }).always(function () {
      button.prop('disabled', false).text('Отправить сообщение');
    }).done(function (response) {
      if (response && response.success) {
        showToast();
        $('#js-contact-form')[0].reset();
        $('.contact__error').text('');
      }
    }).fail(function () {
      showToast();
      $('#js-contact-form')[0].reset();
      $('.contact__error').text('');
    });
  });
});
