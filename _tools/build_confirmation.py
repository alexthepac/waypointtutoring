#!/usr/bin/env python3
"""Builds /en/confirmation/ and /fr/confirmation/ from one template.
Run from the site root: python3 build_confirmation.py"""

PLAY = '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg></span>'


# ---- Purchases (Acuity Scheduling). Prices as shown in the Acuity catalog,
# October 15, 2026. Change a price or a link here, then re-run this script.
ACUITY = {
    'core':      'https://app.acuityscheduling.com/catalog.php?owner=40491971&action=addCart&clear=1&id=2298096',
    'intensive': 'https://app.acuityscheduling.com/catalog.php?owner=40491971&action=addCart&clear=1&id=2298104',
    'complete':  'https://app.acuityscheduling.com/catalog.php?owner=40491971&action=addCart&clear=1&id=2298106',
    'single':    'https://app.acuityscheduling.com/schedule.php?owner=40491971&appointmentType=98757799',
    'pack5':     'https://app.acuityscheduling.com/catalog.php?owner=40491971&action=addCart&clear=1&id=2286689',
}
BIWEEKLY = {'core': 350, 'intensive': 450, 'complete': 575}   # CA$ every 2 weeks
# Semester totals (8 payments) and the pay-in-full price are deliberately
# not shown on the page; only the price every 2 weeks is.
SINGLE, PACK5 = 65, 300   # tutoring: one session; five sessions (60 each)
THRESHOLD = {'core': 33, 'intensive': 35, 'complete': 35}

T = {
'en': dict(
  lang='en', other='fr', locale='en_CA', self_='../../en/confirmation/', twin='../../fr/confirmation/', home='../../en/', staff='../../en/staff/',
  title="You're all set: before your MNTR consultation",
  desc="Your free MNTR consultation is booked. A short welcome video, our mentorship and tutoring options, and how to reach us before the call.",
  skip='Skip to content', menu='Menu', open_menu='Open menu', close_menu='Close menu', home_label='MNTR, home', lang_label='Language',
  contact_nav='Contact', legal='../legal/', cookie_settings='Cookie settings', cancel_contract='Cancel a contract', all_legal='All legal information',
  nav=[('Home','{home}'),('How it works','{home}#how'),('Our programs','{home}#programs'),('Our team','{staff}'),('Book a consultation','{home}#book'),('After you apply','./')],
  policies='Policies', pol=[('terms','Terms and Conditions (R-Score Guarantee)'),('cancellation','Cancellation Policy'),('payment','Payment Policy'),('privacy','Privacy Policy')],
  photo_alt='',
  # A
  booked_h="You're all set. Here's what happens next.",
  applied_h="Welcome to MNTR. Here's what happens next.",
  applied_sub='Haven\'t picked a time yet? <a href="{home}#book">Choose one on the homepage</a>.',
  soon='Video coming soon',
  card_label='Your consultation', card_p='Online video call. The link is in your confirmation email.',
  note='Your confirmation email from Acuity Scheduling has the link to the call and lets you reschedule. If you don\'t see it, check your spam folder.',
  welcome_aria='Welcome',
  # B
  programs_aria='Our services',
  mentor_h='Our Mentorship Program', mentor_sub="What's included in our offer?",
  faq_h='Your questions, answered on video',
  vfaq_tutor=[('TUTOR_COST_VIDEO', 'How much does tutoring cost?')],
  vfaq_mentor=[('OFFER_VIDEO', "What's included in our offer?"), ('MENTOR_RISK_VIDEO', 'How risky is this?'), ('MENTOR_COST_VIDEO', 'How much does the program cost?')],
  tutor_h='Traditional Online Tutoring', orw='or',
  # C
  pkg_h='Packages',
  mentor_kick='Our Mentorship Program', tutor_kick='Traditional Online Tutoring',
  pkg_lead='Three semester-long programs, each across the 16-week semester, with a mentor who plans the work alongside your child.',
  guarantee='R-score guarantee', core='Core', intensive='Intensive', complete='Complete Intensive',
  core_for='The complete mentorship program, with one hour of tutoring every week.',
  core_list=['1 hour of personalized tutoring every week','Exam review sessions every two weeks','Courses on study strategies and exam strategies','A monthly session with the mentor to put those strategies into practice','A personalized study schedule every week','The mentor available by text for questions and support','MNTR\'s own study material','Help finding and applying to volunteering and internship opportunities'],
  int_for='Built for students aiming at the most demanding programs: medicine, dentistry, honours physics and honours math.',
  int_plus='Everything in Core, and:',
  int_list=['2 hours of personalized tutoring every week, instead of 1','For parents, a call with a founder whenever you want one'],
  comp_list=['3 hours of personalized tutoring every week, instead of 1','For parents, a call with a founder whenever you want one'],
  money=lambda n: 'CA$' + format(n, ','),
  every2='every 2 weeks', pay2='Pay every 2 weeks',
  bulk='Pay in full', save5='Save 5%', bulk_note='Arranged at your consultation.',
  t_single='Single session', t_single_p='{p} per one-hour session', t_single_b='Book a session',
  t_pack='5-session package', t_pack_p='{p} ({e} per session)', t_pack_save='Save {d}', t_pack_b='Buy the package',
  remedy='If an eligible student doesn\'t exceed their program\'s threshold, MNTR provides a separate mentorship program the following semester, free of charge, subject to the program conditions. It is not a refund, and MNTR does not guarantee admission to any program.',
  terms_link='read the full guarantee terms',
  invest="During your consultation, we'll help you identify the program that best fits your child's goals and walk you through the investment and available payment options.",
  per_sem='per semester', per_hour='per hour',
  tutor_name='One-on-one tutoring',
  tutor_who='One-on-one tutoring with students from Medicine, Med-P, Dent-P and Quebec’s other most demanding programs.',
  tutor_p='Focused, personalized academic support for students who prefer traditional one-on-one tutoring without the additional structure of a full mentorship program.',
  tutor_links=[('meet the tutors','{staff}'),('ask us about tutoring','#contact')],
  # D
  contact_h='Contact us',
  contact_lede='A question before the call, or something we should know? Write to us, call or text.',
  reach=[('Email','<a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a>'),('Call or text','<a href="tel:+15146520018">+1 514-652-0018</a>'),('Instagram','<a href="https://www.instagram.com/mntrtutoring/" target="_blank" rel="noopener">@mntrtutoring</a>'),('LinkedIn','<a href="https://www.linkedin.com/company/mntrtutoring/" target="_blank" rel="noopener">MNTR Tutoring</a>')],
  f_name='Name', f_email='Email', f_topic='Subject', f_opt='(optional)', f_msg='Message', f_send='Send message',
  f_topic_ph='e.g. a question about Intensive',
  f_legal='We use these details only to reply to you. See our <a href="../legal/#privacy">privacy policy</a>.',
  # footer
  f_blurb='Academic mentorship for CEGEP students in Quebec. Tutoring, weekly planning, exam preparation and university guidance, from one dedicated mentor.',
  f_explore='Explore', f_ex=[('How it works','{home}#how'),('Our programs','{home}#programs'),('Common questions','{home}#faq'),('Our team','{staff}'),('Book a consultation','{home}#book')],
  f_pol=[('terms','Terms and Conditions'),('cancellation','Cancellation Policy'),('payment','Payment Policy'),('privacy','Privacy Policy')],
  f_contact='Contact', f_lang='Language', lang_self='English', lang_other='Français',
  credit='Photo: <a href="https://commons.wikimedia.org/wiki/File:Radcliffe_Camera_Oxford_2018_02.jpg" target="_blank" rel="noopener">Julian Herzog</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>, edited. MNTR is not affiliated with the University of Oxford.',
  tagline='More than just tutoring', copy='© 2026 MNTR Tutoring, Québec', nav_aria='Site menu',
  doc_kind='Document', doc_title='Policy', doc_close='Close document', doc_tabs='Policies',
),
'fr': dict(
  lang='fr', other='en', locale='fr_CA', self_='../../fr/confirmation/', twin='../../en/confirmation/', home='../../fr/', staff='../../fr/equipe/',
  title='Tout est prêt : avant votre consultation MNTR',
  desc="Votre consultation gratuite avec MNTR est réservée. Une courte vidéo de bienvenue, nos options de mentorat et de tutorat, et comment nous joindre avant l'appel.",
  skip='Aller au contenu', menu='Menu', open_menu='Ouvrir le menu', close_menu='Fermer le menu', home_label='MNTR, accueil', lang_label='Langue',
  contact_nav='Nous joindre', legal='../juridique/', cookie_settings='Paramètres des témoins', cancel_contract='Annuler un contrat', all_legal='Toutes les informations juridiques',
  nav=[('Accueil','{home}'),('Comment ça marche','{home}#how'),('Nos programmes','{home}#programs'),('Notre équipe','{staff}'),('Réserver une consultation','{home}#book'),('Après votre demande','./')],
  policies='Politiques', pol=[('terms','Conditions générales (garantie de cote R)'),('cancellation',"Politique d'annulation"),('payment','Politique de paiement'),('privacy','Politique de confidentialité')],
  photo_alt='',
  booked_h='Tout est prêt. Voici la suite.',
  applied_h='Bienvenue chez MNTR. Voici la suite.',
  applied_sub='Vous n\'avez pas encore choisi de moment? <a href="{home}#book">Choisissez-en un sur la page d\'accueil</a>.',
  soon='Vidéo à venir',
  card_label='Votre consultation', card_p='Appel vidéo en ligne. Le lien est dans votre courriel de confirmation.',
  note="Votre courriel de confirmation d'Acuity Scheduling contient le lien de l'appel et vous permet de changer l'heure. Vous ne le trouvez pas? Vérifiez vos courriels indésirables.",
  welcome_aria='Bienvenue',
  programs_aria='Nos services',
  mentor_h='Notre programme de mentorat', mentor_sub='Que comprend notre offre ?',
  faq_h='Vos questions, en vidéo',
  vfaq_tutor=[('TUTOR_COST_VIDEO', 'Combien coûte le tutorat ?')],
  vfaq_mentor=[('OFFER_VIDEO', 'Que comprend notre offre ?'), ('MENTOR_RISK_VIDEO', 'Est-ce risqué ?'), ('MENTOR_COST_VIDEO', 'Combien coûte le programme ?')],
  tutor_h='Tutorat traditionnel en ligne', orw='ou',
  pkg_h='Forfaits',
  mentor_kick='Notre programme de mentorat', tutor_kick='Tutorat traditionnel en ligne',
  pkg_lead="Trois programmes d'une session chacun, sur les 16 semaines de la session, avec un mentor qui planifie le travail avec votre enfant.",
  guarantee='Garantie de cote R', core='Core', intensive='Intensif', complete='Intensif complet',
  core_for='Le programme de mentorat complet, avec une heure de tutorat chaque semaine.',
  core_list=['1 heure de tutorat personnalisé chaque semaine',"Des séances de révision d'examens aux deux semaines","Des cours sur les stratégies d'étude et les stratégies d'examen",'Une séance par mois avec le mentor pour mettre ces stratégies en pratique',"Un horaire d'étude personnalisé chaque semaine",'Le mentor joignable par texto pour les questions et le soutien',"Le matériel d'étude propre à MNTR",'De l\'aide pour trouver des occasions de bénévolat et de stage, et pour y postuler'],
  int_for='Conçu pour les étudiants qui visent les programmes les plus exigeants : médecine, médecine dentaire, physique et mathématiques spécialisées.',
  int_plus='Tout ce que comprend Core, et :',
  int_list=['2 heures de tutorat personnalisé chaque semaine, au lieu de 1','Pour les parents, un appel avec un fondateur quand vous le souhaitez'],
  comp_list=['3 heures de tutorat personnalisé chaque semaine, au lieu de 1','Pour les parents, un appel avec un fondateur quand vous le souhaitez'],
  money=lambda n: format(n, ',').replace(',', '\u00a0') + '\u00a0$',
  every2='aux deux semaines', pay2='Payer aux deux semaines',
  bulk='En un seul versement', save5='Économisez 5\u00a0%', bulk_note='À convenir lors de votre consultation.',
  t_single='Séance à l\u2019unité', t_single_p='{p} par séance d\u2019une heure', t_single_b='Réserver une séance',
  t_pack='Forfait de 5 séances', t_pack_p='{p} ({e} la séance)', t_pack_save='Économisez {d}', t_pack_b='Acheter le forfait',
  remedy="Si un étudiant admissible ne dépasse pas le seuil de son programme, MNTR lui offre un programme de mentorat distinct la session suivante, sans frais, sous réserve des conditions du programme. Ce n'est pas un remboursement, et MNTR ne garantit l'admission à aucun programme.",
  terms_link='lire les conditions complètes de la garantie',
  invest='Lors de votre consultation, nous déterminerons avec vous le programme le mieux adapté aux objectifs de votre enfant et vous présenterons les tarifs ainsi que les modalités de paiement disponibles.',
  per_sem='par session', per_hour="de l'heure",
  tutor_name='Tutorat individuel',
  tutor_who='Du tutorat individuel avec des étudiants en médecine, en Med-P, en Dent-P et dans d\u2019autres programmes parmi les plus exigeants du Québec.',
  tutor_p="Un soutien scolaire ciblé et personnalisé, pour les étudiants qui préfèrent le tutorat individuel traditionnel, sans l'encadrement plus complet d'un programme de mentorat.",
  tutor_links=[('rencontrer les tuteurs','{staff}'),('nous écrire au sujet du tutorat','#contact')],
  contact_h='Nous joindre',
  contact_lede="Une question avant l'appel, ou quelque chose qu'on devrait savoir? Écrivez-nous, appelez-nous ou textez-nous.",
  reach=[('Courriel','<a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a>'),('Appel ou texto','<a href="tel:+15146520018">+1 514-652-0018</a>'),('Instagram','<a href="https://www.instagram.com/mntrtutoring/" target="_blank" rel="noopener">@mntrtutoring</a>'),('LinkedIn','<a href="https://www.linkedin.com/company/mntrtutoring/" target="_blank" rel="noopener">MNTR Tutoring</a>')],
  f_name='Nom', f_email='Courriel', f_topic='Sujet', f_opt='(facultatif)', f_msg='Message', f_send='Envoyer',
  f_topic_ph='p. ex. une question sur le programme Intensif',
  f_legal='Nous utilisons ces renseignements uniquement pour vous répondre. Consultez notre <a href="../juridique/#privacy">politique de confidentialité</a>.',
  f_blurb="Mentorat scolaire pour les étudiants du cégep au Québec. Tutorat, planification hebdomadaire, préparation aux examens et orientation universitaire, avec un seul mentor attitré.",
  f_explore='Explorer', f_ex=[('Comment ça marche','{home}#how'),('Nos programmes','{home}#programs'),('Questions fréquentes','{home}#faq'),('Notre équipe','{staff}'),('Réserver une consultation','{home}#book')],
  f_pol=[('terms','Conditions générales'),('cancellation',"Politique d'annulation"),('payment','Politique de paiement'),('privacy','Politique de confidentialité')],
  f_contact='Contact', f_lang='Langue', lang_self='Français', lang_other='English',
  credit='Photo : <a href="https://commons.wikimedia.org/wiki/File:Radcliffe_Camera_Oxford_2018_02.jpg" target="_blank" rel="noopener">Julian Herzog</a>, <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank" rel="noopener">CC BY 4.0</a>, modifiée. MNTR n\'est pas affiliée à l\'Université d\'Oxford.',
  tagline='Bien plus que du tutorat', copy='© 2026 Tutorat MNTR, Québec', nav_aria='Menu du site',
  doc_kind='Document', doc_title='Politique', doc_close='Fermer le document', doc_tabs='Politiques',
),
}


def build(lang):
    t = T[lang]
    f = lambda s: s.format(home=t['home'], staff=t['staff'])
    other_up = t['other'].upper(); self_up = lang.upper()
    nav = ''.join(f'\n    <li class="stag"><a href="{f(h)}"{" aria-current=\"page\"" if h == "./" else ""}{" data-track=\"menu_apply\"" if h.endswith("#book") else ""}>{n}</a></li>' for n, h in t['nav'])
    pol = ''.join(f'\n      <li><a href="{t["legal"]}#{k}" data-policy="{k}">{n}</a></li>' for k, n in t['pol']) + f'\n      <li><button type="button" data-cookie-settings>{t["cookie_settings"]}</button></li>\n      <li><a href="{t["legal"]}#cancel">{t["cancel_contract"]}</a></li>'
    fpol = ''.join(f'\n          <li><a href="{t["legal"]}#{k}" data-policy="{k}">{n}</a></li>' for k, n in t['f_pol']) + f'\n          <li><button type="button" data-cookie-settings>{t["cookie_settings"]}</button></li>\n          <li><a href="{t["legal"]}#cancel">{t["cancel_contract"]}</a></li>\n          <li><a href="{t["legal"]}">{t["all_legal"]}</a></li>'
    fex = ''.join(f'\n          <li><a href="{f(h)}">{n}</a></li>' for n, h in t['f_ex'])
    core = ''.join(f'<li>{x}</li>' for x in t['core_list'])
    intl = f'<li class="o-pkg-plus">{t["int_plus"]}</li>' + ''.join(f'<li>{x}</li>' for x in t['int_list'])
    reach = ''.join(f'\n            <div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in t['reach'])
    tlinks = ''.join(f'<a class="o-link" href="{f(h)}">{n}</a>' for n, h in t['tutor_links'])
    frame = lambda slot, extra='': f'''<div class="video-frame" data-slot="{slot}"{extra}>
              <div class="video-empty">{PLAY}<span class="label">{t['soon']}</span></div>
            </div>'''
    M = t['money']
    compl = f'<li class="o-pkg-plus">{t["int_plus"]}</li>' + ''.join(f'<li>{x}</li>' for x in t['comp_list'])
    def buy(key, label):
        href = ACUITY[key].replace('&', '&amp;')
        return f'<a class="btn o-buy" data-buy href="{href}" target="_blank" rel="noopener">{label}</a>'
    def pkg(key, name, who, items):
        per = BIWEEKLY[key]
        return f'''<article class="o-pkg" aria-labelledby="pkg-{key}">
              <h3 class="o-pkg-name" id="pkg-{key}">{name}</h3>
              <p class="o-pkg-g"><span class="o-pkg-num">&gt; {THRESHOLD[key]}</span><span class="o-pkg-glab">{t['guarantee']}</span></p>
              <p class="o-pkg-for">{who}</p>
              <ul class="o-pkg-list">{items}</ul>
              <div class="o-price-block">
                <p class="o-price-total" style="margin-bottom:10px">{M(per)} <small>{t['every2']}</small></p>
                {buy(key, t['pay2'])}
                <p class="o-price-bulk">{t['bulk']} <span class="o-save">{t['save5']}</span> <span class="o-price-note">{t['bulk_note']}</span></p>
              </div>
            </article>'''
    def vfaq(items):
        out = []
        for i, (slot, q) in enumerate(items):
            out.append(f'''<details class="o-vfaq"{' open' if i == 0 else ''}>
            <summary>{q}</summary>
            <div class="o-video">{frame(slot, ' data-preload="none"')}</div>
          </details>''')
        return '\n          '.join(out)
    sel = f'<span aria-current="page" lang="{lang}">{self_up}</span><a href="{t["twin"]}" lang="{t["other"]}" hreflang="{t["other"]}" data-lang-switch="{t["other"]}">{other_up}</a>'
    return f'''<!DOCTYPE html>
<html lang="{lang}" class="no-js">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://connect.facebook.net https://embed.acuityscheduling.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self' https://mntr-forms.alexthepac.workers.dev https://www.googletagmanager.com https://*.google.com https://*.google.ca https://*.doubleclick.net https://www.googleadservices.com https://connect.facebook.net https://www.facebook.com; frame-src https://app.acuityscheduling.com https://*.doubleclick.net https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self' https://mntr-forms.alexthepac.workers.dev https://app.acuityscheduling.com; upgrade-insecure-requests" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<script src="../../consent.js?v=6"></script>

<title>{t['title']}</title>
<meta name="description" content="{t['desc']}" />
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="https://mntrtutoring.ca/{lang}/confirmation/" />
<link rel="alternate" hreflang="en" href="https://mntrtutoring.ca/en/confirmation/" />
<link rel="alternate" hreflang="fr" href="https://mntrtutoring.ca/fr/confirmation/" />
<link rel="icon" type="image/png" href="../../assets/img/favicon.png" />
<link rel="shortcut icon" href="../../assets/img/favicon.ico" />
<link rel="apple-touch-icon" href="../../assets/img/apple-touch-icon.png" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="{t['locale']}" />
<meta property="og:title" content="{t['title']}" />
<meta property="og:url" content="https://mntrtutoring.ca/{lang}/confirmation/" />
<meta property="og:image" content="https://mntrtutoring.ca/hero.jpg" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,400..900;1,62..125,400..700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../../assets/css/mntr.css?v=22" />
<link rel="stylesheet" href="../../assets/css/orwell.css?v=22" />
<script src="../../assets/js/media.js?v=7"></script>
<script src="../../assets/js/policies.{lang}.js?v=6"></script>
</head>

<body class="theme-o o-paged">
<a class="skip-link" href="#main">{t['skip']}</a>

<header class="site-header o-header">
  <div class="wrap o-head">
    <button id="burger" class="o-menu" type="button" aria-label="{t['open_menu']}" aria-expanded="false" aria-controls="nav"><span class="o-menu-txt">{t['menu']}</span></button>
    <a class="o-logo" href="{t['home']}" aria-label="{t['home_label']}"><img src="../../assets/img/logo-mark.png" alt="" width="30" height="30" />MNTR</a>
    <div class="o-right">
      <nav class="lang" aria-label="{t['lang_label']}">
        {sel}
      </nav>
      <a class="o-apply" href="#contact">{t['contact_nav']}</a>
    </div>
  </div>
</header>

<div id="navScrim" class="nav-scrim" aria-hidden="true"></div>
<nav id="nav" class="nav" aria-label="{t['nav_aria']}">
  <div class="nav-top">
    <span class="label">{t['menu']}</span>
    <button class="nav-close" type="button" data-nav-close aria-label="{t['close_menu']}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <ul class="nav-list">{nav}
  </ul>
  <div class="nav-policies stag">
    <span class="label">{t['policies']}</span>
    <ul>{pol}
    </ul>
  </div>
  <div class="nav-foot stag">
    <nav class="lang" aria-label="{t['lang_label']}">
      {sel}
    </nav>
    <p class="contact"><a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a><br /><a href="tel:+15146520018">+1 514-652-0018</a></p>
  </div>
</nav>

<!-- The homepage's Oxford photograph, once, fixed behind every panel. The gaps
     between panels look through to it. -->
<div class="o-bg" aria-hidden="true">
  <img src="../../assets/media/hero-radcliffe.webp" srcset="../../assets/media/hero-radcliffe-1200.webp 1200w, ../../assets/media/hero-radcliffe.webp 2400w" sizes="100vw" alt="" width="2400" height="1336" decoding="async" />
</div>

<!-- data-confirmation: mntr.js reads ?status=booked (sent only by Acuity's
     conversion snippet) and shows the matching heading. data-twin is the
     other-language route, used when a booker's saved language differs. -->
<main id="main" class="o-panels" data-confirmation data-twin="{t['twin']}">

  <!-- ===================================================== A. WELCOME -->
  <section class="o-pnl o-pnl--glass o-pnl--welcome" aria-label="{t['welcome_aria']}">
    <div class="wrap">
      <div data-state="booked" hidden>
        <h1 class="o-h o-h--big">{t['booked_h']}</h1>
      </div>
      <div data-state="applied">
        <h1 class="o-h o-h--big">{t['applied_h']}</h1>
        <p class="o-sub">{f(t['applied_sub'])}</p>
      </div>
      <div class="o-video o-video--hero">
        <!-- MNTR_MEDIA.welcomeVideo in /assets/js/media.js, this page's language only -->
        {frame('WELCOME_VIDEO')}
      </div>
      <div class="booking-card" data-booking-card hidden>
        <span class="label">{t['card_label']}</span>
        <span class="when" data-booking-when></span>
        <p>{t['card_p']}</p>
      </div>
      <p class="o-note">{t['note']}</p>
    </div>
  </section>

  <!-- ===================================================== B. QUESTIONS, ON VIDEO
       Tutoring left, mentorship right, as in the packages below; on phones
       mentorship comes first. Each question opens its own video. -->
  <section class="o-pnl o-pnl--glass" id="services" aria-labelledby="faqTitle">
    <div class="wrap">
      <h2 id="faqTitle" class="o-h">{t['faq_h']}</h2>
      <div class="o-split o-split--pkgs">
        <div class="o-col o-col--tutor">
          <h3 class="o-col-h">{t['tutor_h']}</h3>
          {vfaq(t['vfaq_tutor'])}
        </div>
        <div class="o-or" aria-hidden="true"><span>{t['orw']}</span></div>
        <div class="o-col o-col--mentor">
          <h3 class="o-col-h">{t['mentor_h']}</h3>
          {vfaq(t['vfaq_mentor'])}
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================== C. PACKAGES
       Tutoring left, mentorship right (the wider column); on phones mentorship
       comes first. Prices, links and thresholds: constants at the top of
       _tools/build_confirmation.py. -->
  <section class="o-pnl o-pnl--glass" id="packages" aria-labelledby="pkgTitle">
    <div class="wrap">
      <h2 id="pkgTitle" class="o-h">{t['pkg_h']}</h2>
      <div class="o-split o-split--pkgs">
        <div class="o-col o-col--tutor">
          <p class="o-col-kick">{t['tutor_kick']}</p>
          <article class="o-pkg o-pkg--plain" aria-labelledby="pkgTutor">
            <h3 class="o-pkg-name" id="pkgTutor">{t['tutor_name']}</h3>
            <p class="o-pkg-who">{t['tutor_who']}</p>
            <p>{t['tutor_p']}</p>
            <ul class="o-offers">
              <li><span class="o-offer-name">{t['t_single']}</span><span class="o-offer-price">{t['t_single_p'].format(p=M(SINGLE))}</span>{buy('single', t['t_single_b'])}</li>
              <li><span class="o-offer-name">{t['t_pack']} <span class="o-save">{t['t_pack_save'].format(d=M(SINGLE * 5 - PACK5))}</span></span><span class="o-offer-price">{t['t_pack_p'].format(p=M(PACK5), e=M(PACK5 // 5))}</span>{buy('pack5', t['t_pack_b'])}</li>
            </ul>
            <div class="o-links">{tlinks}</div>
          </article>
        </div>
        <div class="o-or" aria-hidden="true"><span>{t['orw']}</span></div>
        <div class="o-col o-col--mentor">
          <p class="o-col-kick">{t['mentor_kick']}</p>
          <p class="o-col-p o-col-p--lead">{t['pkg_lead']}</p>
          <div class="o-pkgs o-pkgs--stack">
            {pkg('core', t['core'], t['core_for'], core)}
            {pkg('intensive', t['intensive'], t['int_for'], intl)}
            {pkg('complete', t['complete'], t['int_for'], compl)}
          </div>
          <p class="o-remedy">{t['remedy']}</p>
          <div class="o-links"><a class="o-link" href="{t['legal']}#terms" data-policy="terms">{t['terms_link']}</a></div>
          <p class="o-invest">{t['invest']}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================== D. CONTACT -->
  <section class="o-pnl o-pnl--glass" id="contact" aria-labelledby="contactTitle">
    <div class="wrap">
      <h2 id="contactTitle" class="o-h o-h--big">{t['contact_h']}</h2>
      <p class="o-lede">{t['contact_lede']}</p>
      <div class="o-contact">
        <dl class="o-reach">{reach}
        </dl>
        <!-- Same delivery as the previous contact page: the MNTR form Worker
             (validates, rate-limits, forwards to mntrtutoring.info@gmail.com). -->
        <form class="o-form" data-contact-form action="https://mntr-forms.alexthepac.workers.dev/api/contact" method="post">
          <div class="o-hp" aria-hidden="true"><label>Website <input type="text" name="_honey" tabindex="-1" autocomplete="off" /></label></div>
          <div class="o-f2">
            <div class="o-field"><label for="cName">{t['f_name']}</label><input id="cName" name="name" type="text" required maxlength="100" autocomplete="name" /></div>
            <div class="o-field"><label for="cEmail">{t['f_email']}</label><input id="cEmail" name="email" type="email" required maxlength="254" autocomplete="email" /></div>
          </div>
          <div class="o-field"><label for="cTopic">{t['f_topic']} <small>{t['f_opt']}</small></label><input id="cTopic" name="topic" type="text" maxlength="150" placeholder="{t['f_topic_ph']}" /></div>
          <div class="o-field"><label for="cMsg">{t['f_msg']}</label><textarea id="cMsg" name="message" rows="5" required maxlength="5000"></textarea></div>
          <p class="o-form-legal">{t['f_legal']}</p>
          <div class="o-form-foot">
            <button class="btn" type="submit">{t['f_send']}</button>
            <p class="o-form-status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="wrap">
    <div class="fgrid">
      <div class="fbrand">
        <a class="brand" href="{t['home']}"><img src="../../assets/img/logo-mark-white.png" alt="" width="34" height="34" /> MNTR <small style="color:rgba(247,245,239,.5)">{'Mentorship' if lang=='en' else 'Mentorat'}</small></a>
        <p>{t['f_blurb']}</p>
      </div>
      <div class="fcol">
        <h2 class="fh">{t['f_explore']}</h2>
        <ul>{fex}
        </ul>
      </div>
      <div class="fcol">
        <h2 class="fh">{t['policies']}</h2>
        <ul>{fpol}
        </ul>
      </div>
      <div class="fcol">
        <h2 class="fh">{t['f_contact']}</h2>
        <ul>
          <li><a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a></li>
          <li><a href="tel:+15146520018">+1 514-652-0018</a></li>
          <li><a href="https://www.instagram.com/mntrtutoring/" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://www.linkedin.com/company/mntrtutoring/" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
      <div class="fcol">
        <h2 class="fh">{t['f_lang']}</h2>
        <ul>
          <li><span aria-current="page">{t['lang_self']}</span></li>
          <li><a href="{t['twin']}" lang="{t['other']}" hreflang="{t['other']}" data-lang-switch="{t['other']}">{t['lang_other']}</a></li>
        </ul>
      </div>
    </div>
    <div class="big" aria-hidden="true"></div>
    <div class="fbot">
      <span>{t['copy']}</span>
      <span class="fcredit">{t['credit']}</span>
      <span class="proof-strip" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <span>{t['tagline']}</span>
    </div>
  </div>
</footer>

<div id="docScrim" class="doc-scrim" aria-hidden="true"></div>
<div id="doc" class="doc" role="dialog" aria-modal="true" aria-labelledby="docTitle">
  <div class="doc-sheet">
    <div class="doc-head">
      <div>
        <span class="label" id="docKind">{t['doc_kind']}</span>
        <h2 class="doc-title" id="docTitle">{t['doc_title']}</h2>
      </div>
      <button class="doc-close" type="button" data-doc-close aria-label="{t['doc_close']}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="doc-tabs" id="docTabs" role="tablist" aria-label="{t['doc_tabs']}"></div>
    <div class="doc-body" id="docBody" tabindex="0"></div>
  </div>
</div>

<script src="../../assets/js/mntr.js?v=19"></script>
</body>
</html>
'''


if __name__ == '__main__':
    for lang in ('en', 'fr'):
        open(f'{lang}/confirmation/index.html', 'w').write(build(lang))
        print('wrote', lang)
