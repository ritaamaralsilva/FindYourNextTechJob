function limparHtml(texto) {
  if (!texto) return "";

  return texto
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function classificarArea(titulo, descricao) {
  const texto = `${titulo} ${descricao}`.toLowerCase();

  if (/full[\s-]?stack/.test(texto)) return "fullstack";
  if (/frontend|front-end|react|vue|angular/.test(texto)) return "frontend";
  if (/backend|back-end|node\.?js|\bjava\b|\.net|\bphp\b|spring/.test(texto)) return "backend";
  if (/android|ios\b|mobile|flutter|swift|kotlin|react native/.test(texto)) return "mobile";
  if (/devops|platform engineer|site reliability|\bsre\b|kubernetes|terraform|ci\/cd/.test(texto)) return "devops";
  if (/cloud engineer|cloud architect|\baws\b|\bazure\b|gcp\b/.test(texto)) return "cloud";
  if (/data scientist|machine learning|\bai engineer\b|deep learning|nlp\b/.test(texto)) return "ai-ml";
  if (/data engineer|etl|data pipeline|big data/.test(texto)) return "data-engineering";
  if (/data analyst|business intelligence|power bi|tableau/.test(texto)) return "data-analytics";
  if (/database administrator|\bdba\b/.test(texto)) return "dba";
  if (/system administrator|sysadmin|network engineer/.test(texto)) return "infra";
  if (/security engineer|cybersecurity|\bsoc\b|pentest/.test(texto)) return "seguranca";
  if (/qa engineer|test automation|quality assurance|\bqa\b/.test(texto)) return "qa";
  if (/ui\/ux|ux designer|ui designer|product designer/.test(texto)) return "design";
  if (/product manager\b/.test(texto)) return "product";
  if (/scrum master|agile coach|technical project manager/.test(texto)) return "gestao-projeto";
  if (/engineering manager|tech lead|team lead|dev lead/.test(texto)) return "lideranca";
  if (/software architect|solutions architect/.test(texto)) return "arquitetura";

  return "outra";
}

function classificarSenioridade(titulo, descricao = "") {
  const texto = `${titulo} ${descricao}`.toLowerCase();

  if (/estágio|estagiário|intern\b|trainee|recém[\s-]?licenciado|recent graduate|graduate program|sem experiência|no experience required/.test(texto)) {
    return "estagio";
  }
  if (/principal|staff|\bsr\.?\b|senior|sénior|lead\b/.test(texto)) return "senior";
  if (/\bjr\.?\b|junior|júnior|entry[\s-]?level/.test(texto)) return "junior";
  return "mid";
}

function classificarRegime(titulo, descricao) {
  const texto = `${titulo} ${descricao}`.toLowerCase();

  if (/remoto|remote|home[\s-]?office/.test(texto)) return "remoto";
  if (/híbrido|hibrido|hybrid/.test(texto)) return "hibrido";
  return "presencial";
}

function extrairTecnologias(descricao) {
  const stackConhecida = [
    "React", "Vue", "Angular", "Svelte", "Next.js", "Node.js", "Express",
    "NestJS", "Java", "Spring", "Kotlin", "Python", "Django", "Flask",
    "FastAPI", "C#", ".NET", "C++", "PHP", "Laravel", "TypeScript",
    "JavaScript", "Swift", "Flutter", "React Native", "SQL", "MySQL",
    "PostgreSQL", "MongoDB", "Redis", "AWS", "Azure", "GCP", "Docker",
    "Kubernetes", "Terraform", "Jenkins", "GitLab CI", "GitHub Actions",
    "TensorFlow", "PyTorch", "scikit-learn", "Power BI", "Tableau",
    "Salesforce", "SAP",
  ];

  return stackConhecida
    .filter((tech) => new RegExp(`\\b${tech.replace(/[.+]/g, "\\$&")}\\b`, "i").test(descricao))
    .join(",");
}

module.exports = {
  limparHtml,
  classificarArea,
  classificarSenioridade,
  classificarRegime,
  extrairTecnologias,
};