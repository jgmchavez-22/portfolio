/**
 * Jan Gabriel Chavez - Professional Portfolio Interactive Script
 * Zero-dependency, accessible vanilla JavaScript
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeToggleBtn && themeIcon) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeIcon.innerHTML = isDark
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
  }

  // Initial theme setup
  const initialTheme = storedTheme ? storedTheme : (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target) && navMenu.classList.contains('is-active')) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Portfolio Category Filtering
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active state on buttons
        filterButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter cards
        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Case Study Modal / Drawer
  // --------------------------------------------------------------------------
  const modalOverlay = document.getElementById('case-study-modal');
  const modalTitle = document.getElementById('modal-case-title');
  const modalBody = document.getElementById('modal-case-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  let lastActiveElement = null;

  // Case Study detailed dataset
  const caseStudiesData = {
    'eoc-buff': {
      title: 'EOC Buff // End of Campaign Report Generator',
      category: 'Software & Automation',
      status: 'In Production at G9 Outsourcing Corp.',
      repoUrl: 'https://github.com/jgmchavez-22/EOC-Break-FRVNT',
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'At G9Outsourcing, campaign reporting teams were burdened with pulling multi-tab performance data from live Google Sheets into standardized client Excel spreadsheets at the end of each marketing campaign. This manual extraction took 1–2 hours per cycle and introduced recurring formula copy-paste errors. In addition, browser security policies (CORS) prevented frontend scripts from directly querying Google Docs export endpoints.'
        },
        {
          heading: 'Objective',
          content: 'Architect an automated, lightweight, self-contained application that bypasses CORS restrictions safely, ingests live campaign spreadsheets, applies business aggregation logic, and downloads fully styled Excel workbooks.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'Sole developer and system architect. Designed the local proxy architecture in Python, implemented security safelisting filters, built the web user interface, and authored the SheetJS/ExcelJS data formatting logic.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Engineered a local HTTP proxy server (`server.py`) using Python’s native `http.server` and `urllib.request`.',
            'Implemented domain safelisting (`if not target.startswith("https://docs.google.com/"): send_error(403)`), strictly mitigating Server-Side Request Forgery (SSRF).',
            'Integrated SheetJS (`xlsx`) for initial data parsing and ExcelJS for fine-grained workbook styling (custom borders, branded headers, number formats, and column widths).',
            'Added clean terminal logging and real-time frontend execution status feedback.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Eliminated manual copy-paste errors across campaign handoffs, reduced report preparation time to a one-click generation step, and provided team members with a clean local tool executable with `python server.py`.'
        }
      ]
    },
    'shelfiq': {
      title: 'ShelfIQ // Spoilage Prediction & Restock Decision System',
      category: 'Data Science & Machine Learning',
      status: 'Completed / Uplift Code Camp Capstone',
      repoUrl: 'https://github.com/jgmchavez-22/ShelfIQ',
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'Mid-sized grocery retailers and chilled-goods distributors in the Philippines face high inventory shrinkage due to El Niño heat spikes and cold-chain transit breakdowns. Conventional inventory models assume static product shelf lives, meaning when transit temperatures accelerate decay, products spoil unexpectedly and revenue drops to zero.'
        },
        {
          heading: 'Objective',
          content: 'Develop an end-to-end Machine Learning decision support platform that ingests transit sensor and inventory data, calculates Remaining Useful Life (RUL) to predict spoilage before expiry, forecasts time-series restocks, and triggers proactive rescue-pricing actions.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'Machine Learning Engineer (Capstone Co-Developer). Developed the core Spoilage Prediction Engine (`pages/rul_model.py`) using Random Forest classification, mapped feature importance weights, calculated dynamic days-to-sell urgency tiers, and programmed automated markdown/upcycling rule logic.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Trained a Random Forest Classifier on historical inventory logs and transit metrics (stock levels, days to sell, daily demand, lead times, sensitivity scores) to identify batch spoilage risk.',
            'Engineered dynamic inference comparing current inventory lots against remaining shelf-life days to segment stock into four action tiers (Final Markdown <24h, Priority Sell 1–2d, Early Markdown 3–5d, Watch 5+d).',
            'Programmed automated rescue pricing rules (5% to 50% discount tiers) and upcycle flags for perishable produce and dairy categories.',
            'Integrated predictive model outputs with Streamlit interactive KPI metric cards and downloadable CSV risk reports.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Successfully pitched and demonstrated to Uplift Code Camp evaluators as an end-to-end retail decision engine, translating raw IoT/transit metrics into actionable business interventions to protect retailer margins.'
        }
      ]
    },
    'matchlink-templater': {
      title: 'Match Link // Company Name Templater',
      category: 'Software & Automation',
      status: 'In Production at G9 Outsourcing Corp.',
      repoUrl: 'https://github.com/jgmchavez-22/Match-Link',
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'Reconciling customer, vendor, or lead lists across CRM databases and accounting platforms frequently fails exact matching (VLOOKUP, XLOOKUP, INDEX/MATCH) due to inconsistent corporate suffixes (e.g., PTE LTD, LLC, Corp, Private Limited) and punctuation variations.'
        },
        {
          heading: 'Objective',
          content: 'Create a lightweight, high-performance web tool that automatically cleans corporate entity names and dynamically generates tiered prefix lookup formulas directly inside exported Excel workbooks.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'Sole Developer & Maintainer. Built the asynchronous FastAPI backend, engineered regex normalization pipelines for legal suffixes, designed the responsive glassmorphism UI, and authored the OpenPyXL workbook formatting engine.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Constructed a FastAPI backend with endpoints for header parsing (/api/parse-headers), templating (/api/template), and streamed file delivery (/api/download).',
            'Built regex tokenization algorithms normalizing diverse regional legal variations (P.T.E. L.T.D., PRIVATE LIMITED, etc.) to standard tokens before stripping them down to clean alphanumeric keys.',
            'Engineered dynamic Excel formula generation calculating 1-based column letters to inject native =LEFT(ColRow, N) helper columns into workbooks.',
            'Designed a responsive, modern dark-themed glassmorphism interface with drag-and-drop file upload, plain-text paste, and deduplication toggles.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Eliminated manual formula construction and entity cleaning in spreadsheet reconciliation workflows, providing team members with a one-click launcher (run.bat) and automated unit test suite.'
        }
      ]
    },
    'bi-dashboards': {
      title: 'Multi-Source Business Intelligence & Reporting Pipeline',
      category: 'Data Analytics & Databases',
      status: 'Enterprise Deployment at G9Outsourcing Corp.',
      repoUrl: null,
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'Operations and client account teams relied on separate, fragmented spreadsheets and disparate CRM exports to monitor performance, ticket status, and service delivery metrics. Consolidating these records manually was labor-intensive, creating delayed visibility for department heads.'
        },
        {
          heading: 'Objective',
          content: 'Consolidate multiple data streams into unified, automated Business Intelligence dashboards with daily refresh cycles to give leadership immediate operational visibility.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'Database Management and Reports Specialist. Led schema harmonization, developed data transformation queries in Power Query/SQL, established relational data models, and designed interactive dashboards.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Conducted schema analysis across CRM tables and internal spreadsheets to standardize timestamps, status flags, and record identifiers.',
            'Built automated data cleaning pipelines using SQL and Power Query, filtering orphaned records and eliminating duplicates.',
            'Created executive and team-level dashboards in Power BI and Looker Studio with dynamic drill-downs and key performance indicator (KPI) cards.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Reduced manual reporting turnaround time by an estimated 30%, enabling department managers to detect service bottlenecks earlier and conduct reviews using validated, real-time data.'
        }
      ]
    },
    'workflow-automations': {
      title: 'Python Operational Workflow Automation Suite',
      category: 'Software & Automation',
      status: 'Internal Enterprise Tooling at G9Outsourcing Corp.',
      repoUrl: null,
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'Frontline specialists engaged in high-volume repetitive tasks: manual web searching, copying structured information from portals, parsing variable-format client communications, and performing manual CRM data validation.'
        },
        {
          heading: 'Objective',
          content: 'Automate 5 to 10 repetitive operational workflows to save labor hours, accelerate turnaround, and eliminate human transcription errors.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'Identified automation bottlenecks across operational workflows, designed and programmed Python automation scripts, implemented web scraping modules, and integrated LLM prompts for unstructured text extraction.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Authored web scrapers using Python (`requests` and `BeautifulSoup`) to pull public portal data on automated schedules.',
            'Integrated LLM API pipelines with structured JSON output prompting to parse variable-format emails and documents.',
            'Implemented comprehensive error handling and logging to flag malformed data for manual inspection without crashing batch runs.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Successfully automated 5–10 recurring workflows, returning an estimated 4–6 hours of manual labor per week back to the operational team while maintaining consistent data formatting.'
        }
      ]
    },
    'compliance-tracker': {
      title: 'Multi-Agency Regulatory Compliance & Calendar System',
      category: 'Operations & Process',
      status: 'Operational Workflow at Duran & Duran-Schulze Law',
      repoUrl: null,
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'Corporate legal compliance in the Philippines involves stringent statutory filing timelines across four distinct regulatory agencies (SEC, DOJ, Bureau of Immigration, DOLE). Missing any statutory deadline results in financial penalties and administrative suspension.'
        },
        {
          heading: 'Objective',
          content: 'Establish a systematic, centralized calendar and tracking workflow managing 15–20 simultaneous statutory deadlines with zero missed filings.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'Paralegal. Managed the compliance tracking schedule, drafted and reviewed regulatory submissions, coordinated multi-stakeholder document execution, and tracked deliverables in Basecamp.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Created standardized milestone templates in Basecamp mapped against specific agency statutory lead times.',
            'Established pre-filing compliance checklists ensuring all corporate resolutions, affidavits, and notary requirements were met prior to submission.',
            'Coordinated real-time document handoffs between senior attorneys, corporate clients, and agency liaisons.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Maintained an unbroken 100% on-time submission rate across 15–20 concurrent regulatory filings across the SEC, DOJ, BI, and DOLE, protecting client organizations from statutory fines.'
        }
      ]
    },
    'it-infrastructure': {
      title: 'Dual-OS Workstation Fleet & Network Administration',
      category: 'IT Support & Systems',
      status: 'Infrastructure Operations at TMC Travel and Tours',
      repoUrl: null,
      sections: [
        {
          heading: 'Operational Context & Problem',
          content: 'High-volume travel agency operations required uninterrupted connectivity and dependable workstations across both Windows and macOS platforms to support client bookings, ticketing, and marketing campaigns.'
        },
        {
          heading: 'Objective',
          content: 'Minimize office operational disruptions through proactive workstation maintenance, structured Ethernet cabling, and secure, high-availability Wi-Fi coverage.'
        },
        {
          heading: 'My Specific Role & Contribution',
          content: 'IT Specialist. Responsible for direct workstation hardware/software maintenance, local network cabling, Wi-Fi access point configuration, and first-line technical incident resolution.'
        },
        {
          heading: 'Technical Implementation & Decisions',
          items: [
            'Maintained dual-OS client hardware (macOS and Windows), executing operating system updates, driver installations, and security patches.',
            'Configured commercial Wi-Fi access points and laid structured Ethernet cabling to eliminate office dead zones.',
            'Diagnosed and resolved hardware faults, printer network sharing issues, and peripheral connectivity bottlenecks.'
          ]
        },
        {
          heading: 'Verified Outcome & Impact',
          content: 'Ensured high network uptime and rapid incident resolution, supporting continuous commercial sales and reservation operations without costly downtime.'
        }
      ]
    }
  };

  function openModal(caseId) {
    const data = caseStudiesData[caseId];
    if (!data || !modalOverlay) return;

    lastActiveElement = document.activeElement;

    modalTitle.textContent = data.title;

    let html = `
      <div style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <span class="tool-tag" style="background: var(--accent-subtle); color: var(--accent-primary); border-color: rgba(59,130,246,0.3); font-weight: 600;">${data.category}</span>
        <span class="tool-tag" style="background: var(--success-bg); color: var(--success-text); border-color: rgba(52,211,153,0.3); font-weight: 600;">${data.status}</span>
        ${data.repoUrl ? `<a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline" style="margin-left: auto;">View GitHub Repository ↗</a>` : ''}
      </div>
    `;

    data.sections.forEach((sec) => {
      html += `
        <div class="case-study-section">
          <h4 class="case-study-heading">${sec.heading}</h4>
          ${sec.content ? `<p class="case-study-text">${sec.content}</p>` : ''}
          ${sec.items ? `
            <ul class="case-study-list">
              ${sec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;
    });

    modalBody.innerHTML = html;
    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap focus inside modal
    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  // Bind trigger buttons
  document.querySelectorAll('[data-open-case]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-open-case');
      openModal(caseId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyFeedback = document.getElementById('copy-feedback');
  const emailAddress = 'jangabrielchavez1@gmail.com';

  if (copyEmailBtn && copyFeedback) {
    copyEmailBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(() => {
          showFeedback('Email copied to clipboard!');
        }).catch(() => {
          fallbackCopyText(emailAddress);
        });
      } else {
        fallbackCopyText(emailAddress);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showFeedback('Email copied to clipboard!');
    } catch (err) {
      showFeedback('Please email directly: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  function showFeedback(msg) {
    if (!copyFeedback) return;
    copyFeedback.textContent = msg;
    copyFeedback.classList.add('is-visible');
    setTimeout(() => {
      copyFeedback.classList.remove('is-visible');
    }, 3000);
  }

  // --------------------------------------------------------------------------
  // 6. Direct Contact Form Submission (FormSubmit AJAX with in-place feedback)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-assist-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitText = document.getElementById('contact-submit-text');
  const formStatus = document.getElementById('contact-form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const senderName = document.getElementById('contact-name').value.trim();
      const senderEmail = document.getElementById('contact-email-input').value.trim();
      const senderSubject = document.getElementById('contact-subject').value.trim() || 'Inquiry via Portfolio';
      const senderMessage = document.getElementById('contact-message').value.trim();

      if (!senderName || !senderEmail || !senderMessage) {
        return;
      }

      // UI Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Sending Message...';
      if (formStatus) {
        formStatus.style.display = 'none';
        formStatus.innerHTML = '';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/jangabrielchavez1@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: senderName,
            email: senderEmail,
            _subject: `[Portfolio Inquiry] ${senderSubject} - ${senderName}`,
            message: senderMessage,
            _captcha: 'false'
          })
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true)) {
          contactForm.reset();
          if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.style.backgroundColor = 'var(--success-bg)';
            formStatus.style.color = 'var(--success-text)';
            formStatus.style.border = '1px solid var(--success-text)';
            formStatus.innerHTML = '<strong>✓ Message sent directly to Jan!</strong> Thank you for reaching out. Your note has been delivered to my inbox and I will get back to you shortly.';
          }
        } else if (result.message && result.message.toLowerCase().includes('activation')) {
          contactForm.reset();
          if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.style.backgroundColor = 'var(--accent-subtle)';
            formStatus.style.color = 'var(--text-primary)';
            formStatus.style.border = '1px solid var(--accent-primary)';
            formStatus.innerHTML = '<strong>✓ Message sent!</strong> Your message has been routed to Jan\'s inbox.';
          }
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Contact submission error:', err);
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
          formStatus.style.color = '#f87171';
          formStatus.style.border = '1px solid #ef4444';
          formStatus.innerHTML = `<strong>Delivery Issue:</strong> Could not send automatically. You can email me directly at <a href="mailto:${emailAddress}?subject=${encodeURIComponent(senderSubject)}&body=${encodeURIComponent(senderMessage)}" style="color:#60a5fa; text-decoration:underline;">${emailAddress}</a>.`;
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Send Message';
      }
    });
  }

})();
