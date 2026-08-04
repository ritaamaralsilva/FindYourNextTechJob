export const rotulosArea = {
  fullstack: "Full Stack",
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  devops: "DevOps",
  cloud: "Cloud",
  "ai-ml": "IA & Machine Learning",
  "data-engineering": "Engenharia de Dados",
  "data-analytics": "Data Analytics & BI",
  dba: "Administração de Bases de Dados",
  infra: "Infraestrutura & Redes",
  seguranca: "Segurança & Cibersegurança",
  qa: "QA & Testes",
  design: "UI/UX Design",
  product: "Product Management",
  "gestao-projeto": "Gestão de Projeto",
  lideranca: "Liderança Técnica",
  arquitetura: "Arquitetura de Software",
  outra: "Outra",
};

export const rotulosSenioridade = {
  estagio: "Estágio",
  junior: "Júnior",
  mid: "Mid",
  senior: "Sénior",
};

export const rotulosRegime = {
  remoto: "Remoto",
  hibrido: "Híbrido",
  presencial: "Presencial",
};

// ordens fixas para os selects — mais previsível do que ordem alfabética,
// que ficaria estranha misturando "IA & Machine Learning" com "Mobile"
export const ordemArea = [
  "fullstack", "frontend", "backend", "mobile",
  "devops", "cloud", "infra",
  "ai-ml", "data-engineering", "data-analytics", "dba",
  "seguranca", "qa",
  "design", "product", "gestao-projeto", "lideranca", "arquitetura",
  "outra",
];

export const ordemSenioridade = ["estagio", "junior", "mid", "senior"];
export const ordemRegime = ["remoto", "hibrido", "presencial"];