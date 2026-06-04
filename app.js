const state = {
  requirements: [],
  priorities: [],
  activeSection: "problem",
  sections: {
    problem: "",
    solution: "",
    objectives: "",
    methods: "",
    impact: "",
    evaluation: "",
    budget: "",
    sustainability: "",
  },
};

const sectionBlueprints = [
  {
    id: "problem",
    title: "Problem statement",
    goal: "Move from general background to a specific, evidence-backed problem with measurable gap, consequences, scope, and importance.",
    prompts: [
      "Open with 2-3 sentences of background that orient the reviewer to the issue without drifting into unrelated history.",
      "State the gap between what should be happening and what is actually happening, using clear measurable language where possible.",
      "Write the broad problem in this form: The general problem is ... resulting in ...",
      "Support the general problem with research, data, examples, trends, or credible observations that show scale and adversity.",
      "Transition from the broad problem to the specific problem your proposal will address.",
      "Write the focused problem in this form: The specific problem is ... resulting in ...",
      "Explain who is affected, where and when the issue occurs, and whether it is recurring, localized, systemic, or widespread.",
      "Separate visible symptoms from the deeper root cause so the proposal does not chase surface fixes.",
      "Name the existing gaps, limits, barriers, or failed approaches that make current responses insufficient.",
      "Conclude with why addressing or investigating the problem matters for people, institutions, policy, practice, or the field.",
    ],
  },
  {
    id: "solution",
    title: "Proposed solution",
    goal: "Show the intervention, why it is credible, how it fits the problem, and what makes it original or distinctive.",
    prompts: [
      "State exactly what you will build, deliver, test, or change.",
      "Explain why this approach fits the problem better than existing alternatives.",
      "Name the creative, original, or potentially transformative element in the approach.",
      "Show the evidence, theory, pilot learning, or practice knowledge that makes the solution credible.",
      "Clarify the role of partners, assets, permissions, and institutional strengths that make delivery realistic.",
      "Briefly state how success will be assessed without turning this section into the full evaluation plan.",
    ],
  },
  {
    id: "objectives",
    title: "Objectives and outcomes",
    goal: "Translate the idea into specific aims, measurable objectives, outputs, outcomes, and funder-relevant change.",
    prompts: [
      "List 3-5 specific aims or SMART objectives that can realistically be completed within the grant period.",
      "Make each objective measurable with a clear target group, location, timeline, and success indicator.",
      "Distinguish outputs from short-term outcomes, medium-term outcomes, and longer-term impact.",
      "Show how each objective responds to the problem statement and funder priorities.",
      "Avoid vague verbs; use action verbs such as test, implement, train, evaluate, reduce, increase, or validate.",
      "Clarify what success will look like by the end of the grant period.",
    ],
  },
  {
    id: "methods",
    title: "Workplan and methods",
    goal: "Describe activities, sequencing, rigor, staffing, timeline, risk control, and the rationale behind the design.",
    prompts: [
      "Break the work into phases, work packages, or activities with clear sequencing.",
      "Explain the rationale for the design and why the chosen methods are rigorous and feasible.",
      "Name who is responsible for delivery, decision-making, quality control, and partner coordination.",
      "Describe the timeline, milestones, dependencies, and deliverables.",
      "Identify risks, assumptions, ethical issues, data quality issues, and mitigation strategies.",
      "Where relevant, describe reproducibility, transparency, sampling, controls, validation, or authentication steps.",
    ],
  },
  {
    id: "impact",
    title: "Impact and significance",
    goal: "Make the case that the work matters scientifically, socially, institutionally, and for the funder's mission.",
    prompts: [
      "Explain the intellectual merit or knowledge contribution of the work.",
      "Explain the broader social, policy, practice, economic, health, environmental, or institutional benefit.",
      "Show how beneficiaries, stakeholders, or systems will be better off.",
      "Connect the impact claims to evidence, theory, logic model outcomes, or prior learning.",
      "Name the pathway from activities to outputs, outcomes, and longer-term impact.",
      "Show how the project advances the funder's mission and desired outcomes.",
    ],
  },
  {
    id: "evaluation",
    title: "Monitoring and evaluation",
    goal: "Define evaluation questions, indicators, data sources, credible evidence, learning loops, and accountability.",
    prompts: [
      "State the evaluation questions the project must answer.",
      "Select indicators for outputs, outcomes, implementation quality, and participant or stakeholder experience.",
      "Name data sources, tools, collection frequency, responsible people, and analysis methods.",
      "Explain how evidence will be credible, ethical, useful, and appropriate for the context.",
      "Use relevant evaluation criteria such as relevance, coherence, effectiveness, efficiency, impact, and sustainability.",
      "Explain how findings will be used during and after implementation.",
    ],
  },
  {
    id: "budget",
    title: "Budget justification",
    goal: "Connect every major cost to delivery, value, efficiency, resources, and funder rules.",
    prompts: [
      "Name the major cost categories and explain why each is necessary for the workplan.",
      "Connect each cost to objectives, activities, deliverables, staffing, or evaluation.",
      "Show value for money, efficiency, and proportionality without under-resourcing the work.",
      "Identify matched funds, in-kind contributions, indirect costs, restricted costs, and cost-share rules.",
      "Show that team, facilities, partners, equipment, and other resources are adequate for delivery.",
      "Flag any funder-specific budget limits, exclusions, or justification requirements.",
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability and scale",
    goal: "Explain what remains after the grant, how benefits continue, and how the work can be adapted, sustained, or scaled.",
    prompts: [
      "Name the capabilities, systems, evidence, tools, relationships, or services that remain after funding ends.",
      "Explain who will maintain the work and with what resources, governance, or institutional commitments.",
      "Identify assumptions, dependencies, and conditions required for sustainability.",
      "Describe the realistic pathway for adaptation, replication, integration, or scale.",
      "Show how learning, data, or assets will remain usable beyond the grant period.",
      "Connect sustainability claims to the logic model, evaluation findings, and funder priorities.",
    ],
  },
];

const problemStatementRubric = [
  {
    label: "Background",
    guidance: "Set up the issue in 2-3 focused sentences before naming the problem.",
    patterns: [/background|context|overview|in this context|within|sets? up|orientation/i],
  },
  {
    label: "Should versus current",
    guidance: "Compare what should be happening with what is actually happening now.",
    patterns: [/should be|what should|ought|expected|current|actually|what is happening|gap/i],
  },
  {
    label: "General problem",
    guidance: "State the broad problem and the negative consequences it creates.",
    patterns: [/general problem|broader problem|overall problem|resulting in|negative consequence|creates? harm/i],
  },
  {
    label: "Specific problem",
    guidance: "State the focused problem that aligns directly with the proposed work.",
    patterns: [/specific problem|focused problem|particular problem|this project|this study|this proposal|directly address/i],
  },
  {
    label: "Orientation",
    guidance: "Locate the problem by who is affected, where, when, and how it appears.",
    patterns: [/who|where|when|community|district|region|school|organization|population|stakeholder|beneficiar/i],
  },
  {
    label: "Research support",
    guidance: "Use data, research, examples, trends, or credible observations to prove the problem exists.",
    patterns: [/data|evidence|research|study|survey|interview|observation|trend|baseline|source|citation|\d+|percent|%/i],
  },
  {
    label: "Magnitude",
    guidance: "Show the scale, frequency, location, timing, and affected population.",
    patterns: [/\d+|percent|%|frequency|rate|scale|magnitude|prevalence|population|beneficiar|where|when/i],
  },
  {
    label: "Consequences",
    guidance: "Explain the adversity, costs, harms, risks, or missed opportunities caused by the problem.",
    patterns: [/impact|consequence|adversity|cost|harm|affected|disrupt|quality|outcome|risk|missed opportunity|stake/i],
  },
  {
    label: "Existing gap",
    guidance: "Name the unmet need, barrier, limitation, or current response that remains insufficient.",
    patterns: [/existing gap|unmet|insufficient|limited|barrier|constraint|current response|current approach|not enough|inadequate/i],
  },
  {
    label: "Root cause",
    guidance: "Go beneath symptoms using the 5 Whys or another cause-analysis logic.",
    patterns: [/root cause|underlying|cause|why|5 whys|five whys|deeper|beneath|driver/i],
  },
  {
    label: "Symptoms separated",
    guidance: "Distinguish observable symptoms from the deeper problem to avoid surface fixes.",
    patterns: [/symptom|surface|observable|manifest|effect|temporary relief|resurface/i],
  },
  {
    label: "Scope and focus",
    guidance: "Keep the statement narrow, relevant, and free of distracting background details.",
    patterns: [/scope|specific|focused|narrow|localized|widespread|recurring|pattern|not isolated|relevant/i],
  },
  {
    label: "Significance",
    guidance: "Say why addressing or investigating the issue matters to stakeholders, society, institutions, or the field.",
    patterns: [/significant|significance|why.*matters|importance|priority|mission|goal|societal|institution|funder|field/i],
  },
  {
    label: "Forward use",
    guidance: "Indicate how the work can inform policy, practice, systems, future research, or action without leading with the solution.",
    patterns: [/inform|improve|policy|practice|system|recommend|future|research|action|change/i],
  },
];

const sectionRubrics = {
  problem: {
    title: "Problem Statement Rubric",
    source: "Uploaded guides, fundsforNGOs, Leeds, Harvard, and Research Impact Academy",
    items: problemStatementRubric,
  },
  solution: {
    title: "Solution and Approach Rubric",
    source: "NIH approach guidance, NSF merit criteria, and Kellogg logic model logic",
    items: [
      {
        label: "Clear intervention",
        guidance: "State the intervention, product, service, study, or change you will deliver.",
        patterns: [/intervention|solution|approach|deliver|build|implement|test|pilot|service|program/i],
      },
      {
        label: "Problem fit",
        guidance: "Explain why the approach fits the problem and fills the identified gap.",
        patterns: [/fit|align|respond|addresses?|gap|need|problem|barrier|unmet/i],
      },
      {
        label: "Credible rationale",
        guidance: "Use evidence, theory, prior work, pilot learning, or practice knowledge to justify the approach.",
        patterns: [/evidence|theory|rationale|pilot|prior|proven|research|practice|learning|model/i],
      },
      {
        label: "Originality",
        guidance: "Show what is creative, original, innovative, or transformative about the solution.",
        patterns: [/innov|original|creative|novel|transformative|distinct|new|unique/i],
      },
      {
        label: "Delivery capacity",
        guidance: "Name the team, partners, resources, or permissions that make implementation realistic.",
        patterns: [/team|partner|resource|capacity|permission|asset|facility|experience|collabor/i],
      },
      {
        label: "Success mechanism",
        guidance: "Briefly show how success will be assessed or observed.",
        patterns: [/success|assess|measure|indicator|outcome|milestone|evaluation|metric/i],
      },
    ],
  },
  objectives: {
    title: "Objectives and Outcomes Rubric",
    source: "NIH specific aims guidance, SMART objectives practice, and Kellogg logic models",
    items: [
      {
        label: "Specific aims",
        guidance: "State 3-5 specific aims or objectives that are focused and realistic.",
        patterns: [/aim|objective|goal|specific|focus|realistic|complete/i],
      },
      {
        label: "Measurable targets",
        guidance: "Include metrics, baselines, targets, timelines, or success criteria.",
        patterns: [/\d+|percent|%|target|baseline|metric|indicator|timeline|by the end|measure/i],
      },
      {
        label: "Beneficiaries",
        guidance: "Name who benefits or participates, and where the change will occur.",
        patterns: [/beneficiar|participant|community|stakeholder|population|students|patients|farmers|where|location/i],
      },
      {
        label: "Outputs",
        guidance: "Distinguish direct products or deliverables from outcomes.",
        patterns: [/output|deliverable|product|tool|report|training|workshop|dataset|curriculum/i],
      },
      {
        label: "Outcomes",
        guidance: "Name short- or medium-term changes in knowledge, behavior, systems, capacity, or outcomes.",
        patterns: [/outcome|change|increase|reduce|improve|capacity|behavior|knowledge|system|result/i],
      },
      {
        label: "Funder alignment",
        guidance: "Connect objectives to funder priorities and the problem statement.",
        patterns: [/funder|priority|mission|align|problem statement|requirement|call|goal/i],
      },
    ],
  },
  methods: {
    title: "Methods and Workplan Rubric",
    source: "NIH rigor and reproducibility, NIH approach criteria, and NSF review criteria",
    items: [
      {
        label: "Phased workplan",
        guidance: "Break the work into clear activities, phases, milestones, or work packages.",
        patterns: [/phase|activity|work package|milestone|task|timeline|sequence|deliverable/i],
      },
      {
        label: "Design rationale",
        guidance: "Explain why the chosen methods are appropriate for the objectives.",
        patterns: [/rationale|method|design|approach|why|appropriate|feasible|fit/i],
      },
      {
        label: "Rigor",
        guidance: "Address rigor, quality control, validation, sampling, controls, or transparent procedures where relevant.",
        patterns: [/rigor|quality control|validat|sampling|control|protocol|standard|transparent|reproduc/i],
      },
      {
        label: "Roles",
        guidance: "Name who will do the work and who makes decisions.",
        patterns: [/role|responsib|lead|team|partner|coordinat|decision|staff|investigator/i],
      },
      {
        label: "Risk mitigation",
        guidance: "Identify risks, assumptions, dependencies, and mitigation strategies.",
        patterns: [/risk|assumption|dependency|mitigat|challenge|contingency|ethical|constraint/i],
      },
      {
        label: "Feasibility",
        guidance: "Show that the timeline, resources, recruitment, permissions, and logistics are realistic.",
        patterns: [/feasible|realistic|resource|timeline|permission|recruit|logistic|access|capacity/i],
      },
    ],
  },
  impact: {
    title: "Impact and Significance Rubric",
    source: "NIH significance and innovation, NSF intellectual merit and broader impacts, OECD DAC impact",
    items: [
      {
        label: "Knowledge contribution",
        guidance: "Explain how the work advances knowledge, practice, methods, or understanding.",
        patterns: [/advance|knowledge|understanding|practice|method|field|science|evidence|learning/i],
      },
      {
        label: "Broader benefit",
        guidance: "State the social, policy, health, economic, environmental, educational, or institutional benefit.",
        patterns: [/societ|policy|health|economic|environment|education|institution|community|public|benefit/i],
      },
      {
        label: "Beneficiary change",
        guidance: "Describe how beneficiaries, stakeholders, systems, or organizations will be better off.",
        patterns: [/beneficiar|stakeholder|community|population|system|organization|better|improve|change/i],
      },
      {
        label: "Impact pathway",
        guidance: "Connect activities to outputs, outcomes, and longer-term impact.",
        patterns: [/pathway|logic model|output|outcome|impact|activity|longer-term|theory of change/i],
      },
      {
        label: "Evidence basis",
        guidance: "Support impact claims with evidence, theory, data, or prior learning.",
        patterns: [/evidence|theory|data|research|prior|pilot|learning|study|baseline/i],
      },
      {
        label: "Funder mission",
        guidance: "Show how the impact advances the funder's mission or desired societal outcomes.",
        patterns: [/funder|mission|priority|desired outcome|strategic|call|goal|align/i],
      },
    ],
  },
  evaluation: {
    title: "Monitoring and Evaluation Rubric",
    source: "CDC Program Evaluation Framework and OECD DAC evaluation criteria",
    items: [
      {
        label: "Evaluation questions",
        guidance: "State the questions the evaluation will answer.",
        patterns: [/evaluation question|question|answer|assess|determine|learn/i],
      },
      {
        label: "Indicators",
        guidance: "Define output, outcome, implementation, or quality indicators.",
        patterns: [/indicator|metric|measure|output|outcome|implementation|quality|target/i],
      },
      {
        label: "Data sources",
        guidance: "Name tools, data sources, collection frequency, and responsible people.",
        patterns: [/data source|tool|survey|interview|record|monitor|collect|frequency|responsib|analysis/i],
      },
      {
        label: "Credible evidence",
        guidance: "Explain how evidence will be credible, ethical, rigorous, and appropriate for context.",
        patterns: [/credible|ethic|rigor|valid|reliable|appropriate|context|transparen|quality/i],
      },
      {
        label: "DAC criteria",
        guidance: "Use relevant criteria such as relevance, coherence, effectiveness, efficiency, impact, and sustainability.",
        patterns: [/relevance|coherence|effectiveness|efficiency|impact|sustainability|DAC/i],
      },
      {
        label: "Learning use",
        guidance: "Explain how findings will guide decisions, improvement, accountability, or future action.",
        patterns: [/finding|learn|use|decision|improve|accountab|recommend|adapt|action/i],
      },
    ],
  },
  budget: {
    title: "Budget Justification Rubric",
    source: "NSF resource criteria, NIH budget justification practice, and OECD efficiency criteria",
    items: [
      {
        label: "Cost categories",
        guidance: "Name major personnel, equipment, travel, materials, indirect, or partner costs.",
        patterns: [/personnel|salary|equipment|travel|material|supplies|indirect|partner|cost category|budget/i],
      },
      {
        label: "Activity link",
        guidance: "Connect costs to objectives, activities, deliverables, or evaluation needs.",
        patterns: [/objective|activity|deliverable|evaluation|workplan|milestone|output|linked|support/i],
      },
      {
        label: "Necessity",
        guidance: "Explain why each major cost is necessary and allowable.",
        patterns: [/necessary|need|allowable|justified|required|essential|eligible/i],
      },
      {
        label: "Value for money",
        guidance: "Show efficiency, proportionality, and value without weakening delivery.",
        patterns: [/value|efficient|efficiency|cost-effective|proportion|reasonable|economy/i],
      },
      {
        label: "Resources",
        guidance: "Show adequate facilities, equipment, team resources, matching funds, or in-kind support.",
        patterns: [/resource|facility|equipment|match|in-kind|cost share|contribution|asset|support/i],
      },
      {
        label: "Funder rules",
        guidance: "Address funder limits, exclusions, indirect rules, matching rules, or restrictions.",
        patterns: [/funder|limit|restriction|exclude|indirect|match|rule|requirement|cap/i],
      },
    ],
  },
  sustainability: {
    title: "Sustainability and Scale Rubric",
    source: "OECD DAC sustainability, Kellogg logic model, FAIR principles, and NIH data sharing guidance",
    items: [
      {
        label: "Post-grant assets",
        guidance: "Name what remains after funding: capacity, tools, systems, evidence, services, or relationships.",
        patterns: [/after funding|post-grant|remain|capacity|tool|system|evidence|service|relationship|asset/i],
      },
      {
        label: "Ownership",
        guidance: "Identify who will maintain the work and with what governance or commitments.",
        patterns: [/maintain|owner|governance|commitment|institution|partner|responsib|steward/i],
      },
      {
        label: "Resources",
        guidance: "Explain the financial, human, technical, or institutional resources for continuation.",
        patterns: [/resource|finance|funding|staff|technical|institutional|budget|support|commitment/i],
      },
      {
        label: "Scale pathway",
        guidance: "Describe adaptation, replication, integration, policy uptake, or scale.",
        patterns: [/scale|replicat|adapt|integrat|policy|uptake|expand|mainstream|institutionaliz/i],
      },
      {
        label: "Reusable learning",
        guidance: "Show how data, tools, knowledge, or materials will remain findable, accessible, usable, or reusable.",
        patterns: [/data|tool|knowledge|materials|findable|accessible|interoperable|reusable|share|repository/i],
      },
      {
        label: "Assumptions",
        guidance: "Name assumptions, dependencies, conditions, and risks that affect sustainability.",
        patterns: [/assumption|dependency|condition|risk|constraint|mitigat|sustainability|barrier/i],
      },
    ],
  },
};

const fields = {
  projectTitle: document.querySelector("#projectTitle"),
  funderName: document.querySelector("#funderName"),
  ideaText: document.querySelector("#ideaText"),
  grantUrl: document.querySelector("#grantUrl"),
  grantText: document.querySelector("#grantText"),
  documentInput: document.querySelector("#documentInput"),
  requirementsList: document.querySelector("#requirementsList"),
  priorityList: document.querySelector("#priorityList"),
  sectionTabs: document.querySelector("#sectionTabs"),
  activeSectionTitle: document.querySelector("#activeSectionTitle"),
  activeSectionGoal: document.querySelector("#activeSectionGoal"),
  sectionGuidance: document.querySelector("#sectionGuidance"),
  sectionDraft: document.querySelector("#sectionDraft"),
  problemRubric: document.querySelector("#problemRubric"),
  reviewFindings: document.querySelector("#reviewFindings"),
};

function switchPanel(panelId) {
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("is-visible", panel.id === panelId));
  document.querySelectorAll(".step").forEach((step) => step.classList.toggle("is-active", step.dataset.panel === panelId));
}

function normalizeLines(text) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function detectRequirements() {
  const grantText = fields.grantText.value;
  const lines = normalizeLines(grantText);
  const markers = [
    "must",
    "required",
    "requirement",
    "eligible",
    "eligibility",
    "deadline",
    "budget",
    "page",
    "submit",
    "attachment",
    "evaluation",
    "criteria",
    "include",
    "not exceed",
    "applicant",
  ];

  const detected = lines
    .filter((line) => markers.some((marker) => line.toLowerCase().includes(marker)))
    .slice(0, 14)
    .map((text, index) => ({ id: `detected-${index}-${Date.now()}`, text, done: false }));

  state.requirements = detected.length
    ? detected
    : [
        { id: "default-eligibility", text: "Confirm applicant eligibility and geographic eligibility.", done: false },
        { id: "default-deadline", text: "Record submission deadline, format rules, and required attachments.", done: false },
        { id: "default-budget", text: "Identify budget ceiling, eligible costs, match rules, and indirect cost limits.", done: false },
        { id: "default-evaluation", text: "Align every proposal section with the stated evaluation criteria.", done: false },
      ];

  detectPriorities();
  renderRequirements();
  renderReadiness();
}

function detectPriorities() {
  const combined = `${fields.grantText.value}\n${fields.ideaText.value}`.toLowerCase();
  const priorities = [
    ["Innovation", ["innovation", "novel", "creative", "new approach", "breakthrough"]],
    ["Impact", ["impact", "outcomes", "beneficiaries", "results", "change"]],
    ["Equity", ["equity", "gender", "inclusion", "underserved", "marginalized"]],
    ["Evidence", ["evidence", "data", "research", "evaluation", "learning"]],
    ["Scale", ["scale", "replication", "sustainability", "systems", "partnership"]],
  ];

  state.priorities = priorities
    .filter(([, keywords]) => keywords.some((keyword) => combined.includes(keyword)))
    .map(([label, keywords]) => ({
      label,
      note: `Use proposal language that clearly demonstrates ${label.toLowerCase()} through concrete design choices, evidence, and metrics.`,
      keywords,
    }));

  if (!state.priorities.length) {
    state.priorities = [
      { label: "Mission fit", note: "Make the connection between the funder's goals and your idea explicit in every major section." },
      { label: "Measurable outcomes", note: "Convert claims into indicators, baselines, targets, and credible data sources." },
      { label: "Delivery credibility", note: "Show that the team, partners, timeline, and budget can realistically deliver the promised work." },
    ];
  }
}

function renderRequirements() {
  fields.requirementsList.innerHTML = "";
  state.requirements.forEach((requirement) => {
    const card = document.createElement("label");
    card.className = "requirement-card";
    card.innerHTML = `
      <input type="checkbox" ${requirement.done ? "checked" : ""} />
      <p>${escapeHtml(requirement.text)}</p>
    `;
    card.querySelector("input").addEventListener("change", (event) => {
      requirement.done = event.target.checked;
      renderReadiness();
    });
    fields.requirementsList.appendChild(card);
  });

  fields.priorityList.innerHTML = state.priorities
    .map((priority) => `<div class="priority-pill"><strong>${escapeHtml(priority.label)}</strong><p>${escapeHtml(priority.note)}</p></div>`)
    .join("");
}

function renderSections() {
  fields.sectionTabs.innerHTML = "";
  sectionBlueprints.forEach((section) => {
    const button = document.createElement("button");
    button.className = `section-tab ${section.id === state.activeSection ? "is-active" : ""}`;
    button.type = "button";
    button.innerHTML = `${escapeHtml(section.title)}<small>${wordCount(draftCoreText(state.sections[section.id]))} words</small>`;
    button.addEventListener("click", () => {
      saveActiveDraft();
      state.activeSection = section.id;
      renderActiveSection();
      renderSections();
    });
    fields.sectionTabs.appendChild(button);
  });
}

function renderActiveSection() {
  const section = sectionBlueprints.find((item) => item.id === state.activeSection);
  fields.activeSectionTitle.textContent = section.title;
  fields.activeSectionGoal.textContent = section.goal;
  fields.sectionDraft.value = state.sections[section.id];
  fields.sectionGuidance.innerHTML = `
    <strong>${section.id === "problem" ? "Problem statement guidance built into this platform" : "Reviewer guidance built into this platform"}</strong>
    <ul>${section.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}</ul>
  `;
  renderSectionRubric();
}

function insertGuidePrompts() {
  const section = sectionBlueprints.find((item) => item.id === state.activeSection);
  const rubric = sectionRubrics[section.id];
  const rubricText = rubric
    ? `\n\nRequired reviewer-rubric elements (${rubric.source}):\n${rubric.items.map((item) => `- ${item.label}: ${item.guidance}`).join("\n")}`
    : "";
  const promptText = section.prompts.map((prompt) => `- ${prompt}`).join("\n");
  fields.sectionDraft.value = `${fields.sectionDraft.value.trim()}\n\nGuiding notes:\n${promptText}${rubricText}\n`.trim();
  saveActiveDraft();
}

function saveActiveDraft() {
  state.sections[state.activeSection] = fields.sectionDraft.value;
  renderSectionRubric();
  renderReadiness();
}

function renderSectionRubric() {
  const section = sectionBlueprints.find((item) => item.id === state.activeSection);
  const rubric = sectionRubrics[state.activeSection];
  if (!rubric) {
    fields.problemRubric.hidden = true;
    return;
  }

  fields.problemRubric.hidden = false;
  const text = draftCoreText(state.sections[section.id] || fields.sectionDraft.value);
  const results = rubric.items.map((item) => ({ ...item, met: item.patterns.some((pattern) => pattern.test(text)) }));
  const metCount = results.filter((item) => item.met).length;

  fields.problemRubric.innerHTML = `
    <div class="rubric-header">
      <div>
        <strong>${escapeHtml(rubric.title)}</strong>
        <p>Built from ${escapeHtml(rubric.source)}.</p>
      </div>
      <span class="rubric-score">${metCount}/${results.length}</span>
    </div>
    <div class="rubric-grid">
      ${results
        .map(
          (item) => `
            <div class="rubric-item ${item.met ? "is-met" : ""}">
              <span class="rubric-dot">${item.met ? "OK" : "!"}</span>
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <p>${escapeHtml(item.guidance)}</p>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function runReview() {
  saveActiveDraft();
  const allDraft = Object.values(state.sections).map(draftCoreText).join("\n\n");
  const problemDraft = draftCoreText(state.sections.problem);
  const completedSections = Object.values(state.sections).filter((text) => wordCount(draftCoreText(text)) >= 45).length;
  const checkedRequirements = state.requirements.filter((requirement) => requirement.done).length;
  const completeness = Math.round(((completedSections / sectionBlueprints.length) * 65 + requirementRatio() * 35) || 0);
  const persuasiveSignals = [
    "evidence",
    "benefit",
    "outcome",
    "impact",
    "partner",
    "risk",
    "data",
    "research",
    "sustain",
    "budget",
    "timeline",
    "gap",
    "general problem",
    "specific problem",
    "specific aim",
    "indicator",
    "broader impact",
    "logic model",
    "efficiency",
    "root cause",
    "magnitude",
    "sustainability",
  ];
  const signalHits = persuasiveSignals.filter((signal) => allDraft.toLowerCase().includes(signal)).length;
  const persuasiveness = Math.min(100, Math.round((signalHits / persuasiveSignals.length) * 85 + Math.min(wordCount(allDraft) / 1200, 1) * 15));
  const fitHits = state.priorities.filter((priority) => allDraft.toLowerCase().includes(priority.label.toLowerCase())).length;
  const fit = Math.min(100, Math.round((fitHits / Math.max(state.priorities.length, 1)) * 55 + requirementRatio() * 45));

  document.querySelector("#completenessScore").textContent = completeness;
  document.querySelector("#persuasivenessScore").textContent = persuasiveness;
  document.querySelector("#fitScore").textContent = fit;

  const findings = [];
  if (checkedRequirements < state.requirements.length) {
    findings.push(`Address ${state.requirements.length - checkedRequirements} unchecked grant requirement(s) before submission.`);
  }
  sectionBlueprints.forEach((section) => {
    if (wordCount(draftCoreText(state.sections[section.id])) < 45) {
      findings.push(`${section.title} needs more substance. Add evidence, specific activities, measurable results, and funder language.`);
    }
    const rubric = sectionRubrics[section.id];
    if (rubric) {
      const sectionDraft = draftCoreText(state.sections[section.id]);
      rubric.items.forEach((item) => {
        if (!item.patterns.some((pattern) => pattern.test(sectionDraft))) {
          findings.push(`${section.title} is missing ${item.label.toLowerCase()}: ${item.guidance}`);
        }
      });
    }
  });
  if (!/\b\d+|\bpercent|\b%\b/i.test(allDraft)) {
    findings.push("Add numbers: baselines, targets, beneficiary counts, budget figures, timelines, or measurable indicators.");
  }
  if (!/general problem/i.test(problemDraft) || !/specific problem/i.test(problemDraft)) {
    findings.push("Use the problem-statement formula explicitly: name the general problem, then transition to the specific problem your proposal will address.");
  }
  if (!/resulting in|consequence|impact|adversity|harm|cost|risk|missed opportunity/i.test(problemDraft)) {
    findings.push("Each problem statement should show adversity: explain what the problem results in for people, institutions, systems, or the field.");
  }
  if (!/should be|what should|expected|current|actually|what is happening|gap/i.test(problemDraft)) {
    findings.push("Clarify the gap by comparing what should be happening with what is currently happening.");
  }
  if (!/data|evidence|research|study|survey|interview|observation|trend|baseline|\d+|percent|%/i.test(problemDraft)) {
    findings.push("Support the problem with research, data, examples, trends, or credible observations instead of relying only on assertion.");
  }
  if (!/existing gap|unmet|insufficient|limited|barrier|constraint|current response|current approach|not enough|inadequate/i.test(problemDraft)) {
    findings.push("Name the existing gap or limitation: what current services, approaches, resources, or knowledge still fail to solve.");
  }
  if (!/symptom|surface|observable|root cause|underlying|why/i.test(problemDraft)) {
    findings.push("Problem statement should separate visible symptoms from the deeper cause, then explain why the deeper cause is the issue to solve.");
  }
  if (!/scope|specific|focused|narrow|localized|recurring|pattern|trend/i.test(problemDraft)) {
    findings.push("Problem statement should narrow the scope and show whether the issue is recurring, systemic, localized, or widespread.");
  }
  if (/we will|we propose|our solution|solution is|the intervention/i.test(problemDraft) && !/general problem|specific problem|gap|resulting in/i.test(problemDraft)) {
    findings.push("Do not let the problem statement become solution-led. Establish the problem, evidence, consequences, and gap before describing the intervention.");
  }
  if (!/risk|mitigat|challenge/i.test(allDraft)) {
    findings.push("Include implementation risks and mitigation strategies so reviewers trust the delivery plan.");
  }
  if (!/partner|team|collabor/i.test(allDraft)) {
    findings.push("Strengthen credibility by naming team roles, partners, institutional assets, or prior relevant experience.");
  }

  fields.reviewFindings.innerHTML = findings.length
    ? findings.map((finding) => `<div class="finding"><strong>Improve</strong><p>${escapeHtml(finding)}</p></div>`).join("")
    : `<div class="finding"><strong>Ready for refinement</strong><p>Your draft covers the key structural elements. Next, polish voice, evidence quality, and budget alignment.</p></div>`;

  renderReadiness();
}

function renderReadiness() {
  const hasIdea = fields.projectTitle.value.trim() && wordCount(fields.ideaText.value) >= 25;
  const hasGrant = fields.grantText.value.trim() || fields.grantUrl.value.trim();
  const reqScore = requirementRatio();
  const sectionScore = Object.values(state.sections).filter((text) => wordCount(draftCoreText(text)) >= 45).length / sectionBlueprints.length;
  const score = Math.round((hasIdea ? 22 : 0) + (hasGrant ? 18 : 0) + reqScore * 25 + sectionScore * 35);

  document.querySelector("#readinessScore").textContent = `${score}%`;
  document.querySelector("#readinessBar").style.width = `${score}%`;
  document.querySelector("#readinessHint").textContent =
    score < 35
      ? "Start by describing your idea and loading the grant guidance."
      : score < 70
        ? "Keep checking requirements and drafting sections with evidence."
        : "You are moving into polish: tighten claims, metrics, and funder fit.";
}

function requirementRatio() {
  if (!state.requirements.length) return 0;
  return state.requirements.filter((requirement) => requirement.done).length / state.requirements.length;
}

function wordCount(text) {
  return (text.trim().match(/\b[\w'-]+\b/g) || []).length;
}

function draftCoreText(text) {
  const markerIndex = text.indexOf("Guiding notes:");
  return (markerIndex >= 0 ? text.slice(0, markerIndex) : text).trim();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function exportBrief() {
  saveActiveDraft();
  const lines = [
    `# ${fields.projectTitle.value || "Grant Proposal Brief"}`,
    "",
    `Funder: ${fields.funderName.value || "Not specified"}`,
    `Grant URL: ${fields.grantUrl.value || "Not specified"}`,
    "",
    "## Idea",
    fields.ideaText.value || "Not drafted yet.",
    "",
    "## Requirements",
    ...state.requirements.map((requirement) => `- [${requirement.done ? "x" : " "}] ${requirement.text}`),
    "",
    "## Funder Priorities",
    ...state.priorities.map((priority) => `- ${priority.label}: ${priority.note}`),
    "",
    "## Proposal Sections",
    ...sectionBlueprints.flatMap((section) => [`### ${section.title}`, state.sections[section.id] || "Not drafted yet.", ""]),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fields.projectTitle.value.trim().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "grant-proposal-brief"}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll(".step").forEach((step) => {
  step.addEventListener("click", () => switchPanel(step.dataset.panel));
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.next === "requirements") detectRequirements();
    saveActiveDraft();
    switchPanel(button.dataset.next);
  });
});

[fields.projectTitle, fields.funderName, fields.ideaText, fields.grantUrl, fields.grantText].forEach((field) => {
  field.addEventListener("input", renderReadiness);
});

fields.grantText.addEventListener("blur", detectRequirements);
fields.sectionDraft.addEventListener("input", saveActiveDraft);
document.querySelector("#insertPromptButton").addEventListener("click", insertGuidePrompts);
document.querySelector("#runReviewButton").addEventListener("click", runReview);
document.querySelector("#exportButton").addEventListener("click", exportBrief);

document.querySelector("#addRequirementButton").addEventListener("click", () => {
  document.querySelector("#requirementDialog").showModal();
});

document.querySelector("#saveRequirementButton").addEventListener("click", () => {
  const input = document.querySelector("#newRequirementText");
  if (input.value.trim()) {
    state.requirements.push({ id: `manual-${Date.now()}`, text: input.value.trim(), done: false });
    input.value = "";
    renderRequirements();
  }
});

fields.documentInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!/\.(txt|md)$/i.test(file.name)) {
    fields.grantText.placeholder = "For this file type, paste extracted text here so the prototype can analyze it.";
    return;
  }
  fields.grantText.value = await file.text();
  detectRequirements();
});

renderSections();
renderActiveSection();
renderRequirements();
renderReadiness();
