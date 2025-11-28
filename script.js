// == Navegação Smooth Scroll ==
// Função para rolar suavemente até uma seção
function scrollToSection(sectionId){
  // Pega o elemento no DOM pelo id informado
  const element = document.getElementById(sectionId);
  //Se o elemento existe, chama scrollIntoView com comportamento suave
  if (element){
    // {behavior: 'smooth'} informa ao browser a animação de rolagem
    element.scrollIntoView({ behavior: 'smooth' }); // Scroll suave
  }
}

// Seleciona todos os links internos (que começam com #)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault(); // Evita o comportamente padrão do link
    const targetId = this.getAttribute('href').substring(1); // Pega o id da seção
    scrollToSection(targetId); // Chama a função de scroll suave
  });
});

// == Botão Voltar ao Topo ==
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  // Mostrar botão apenas se o scroll passar de 300px
  if(window.pageYOffset > 300) {
    backToTopButton.classList.add('show');
  }else{
    backToTopButton.classList.remove('show');
  }
});

// Scroll suave para o topo ao clicar no botão
backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// == Círculos Laterais ==
// Mapear círculos para rolar até as seções correspondentes
document.querySelectorAll('.circle').forEach((circle, index) => {
  const sections = ['about', 'science', 'makewolf'];
  circle.addEventListener('click', () => {
    scrollToSection(sections[index]);
  });
});

// == Sistema de Genética ==
// Estrutura que mapeia cada traço (trait) para objetos que descrevem imagens e labels
//Cada trait contém sub-chaves que representam genótipos (ex: 'AA', 'Aa', 'aa')
//e apontam para arquivo de imagem e rótulo amigável

const traitMapping = {
  bodyShape: {
    "AA": { img: "./Assets/Corpo/corpoDefault.png", label: "Padrão" }
  },
  fur: {
    "aa": { img: "./Assets/Pelagem/pelagemDefault.png", label: "Cinza" },
    "AA": { img: "./Assets/Pelagem/pelagemAreia.png", label: "Areia" },
    "Aa": { img: "./Assets/Pelagem/pelagemMarrom.png", label: "Marrom" }
  },
  earsColorFormat1: {
    "aa": { img: "./Assets/Cor da Orelha/orelhaDefault1.png", label: "Cinza" },
    "AA": { img: "./Assets/Cor da Orelha/orelhaAreia1.png", label: "Areia" },
    "Aa": { img: "./Assets/Cor da Orelha/orelhaMarrom1.png", label: "Marrom" }
  },
   earsColorFormat2: {
    "aa": { img: "./Assets/Cor da Orelha/orelhaDefault2.png", label: "Cinza" },
    "AA": { img: "./Assets/Cor da Orelha/orelhaAreia2.png", label: "Areia" },
    "Aa": { img: "./Assets/Cor da Orelha/orelhaMarrom2.png", label: "Marrom" }
  },
  earsShape: {
    "AA": { img: "./Assets/Formato da Orelha/formatoDaOrelha1.png", label: "Redondas" },
    "Aa": { img: "./Assets/Formato da Orelha/formatoDaOrelha2.png", label: "Pontudas" },
  },
  eyesColor: {
    "aa": { img: "./Assets/Cor dos Olhos/corDoOlhoDefault.png", label: "Cinza" },
    "AA - Azul": { img: "./Assets/Cor dos Olhos/corDoOlhoAzul.png", label: "Azuis" },
    "Aa": { img: "./Assets/Cor dos Olhos/corDoOlhoAmbar.png", label: "Âmbar" },
    "AA - Verde": { img: "./Assets/Cor dos Olhos/corDoOlhoVerde.png", label: "Verde" }
  },
  eyesShape: {
    "AA": { img: "./Assets/Formato dos Olhos/formatoDoOlhoDefault.png", label: "Redondos" },
    "aa": { img: "./Assets/Formato dos Olhos/formatoDoOlho2.png", label: "Alongados" }
  },
  snoutShape: {
    "AA": { img: "./Assets/Focinho/focinho1.png", label: "Curto" },
    "aa": { img: "./Assets/Focinho/focinho3.png", label: "Longo" }
  }
};

//Atualiza as opções do <select id="earsColor"> baseado no formato da orelha
function updateEarsColorOptions(){
  const earsShapeSelect = document.getElementById('earsShape');
  const earsColorSelect = document.getElementById('earsColor');
  const selectedShape = earsShapeSelect.value;
  
  // Limpar opções atuais
  earsColorSelect.innerHTML = '';
  
  let colorOptions;
  
  // Determinar qual conjunto de cores usar baseado no formato
  if (selectedShape === 'AA') {
    // Formato 1 - Redondas
    colorOptions = traitMapping.earsColorFormat1;
  } else {
    // Formato 2 - Pontudas
    colorOptions = traitMapping.earsColorFormat2;
  }
  
  // Cria opções para cada genótipo disponível na paleta selecionada
  for (const [gene, info] of Object.entries(colorOptions)) {
    const option = document.createElement('option');
    option.value = gene;
    option.textContent = `${info.label} (${gene})`;
    earsColorSelect.appendChild(option);
  }
}

// == Função para obter a imagem correta da cor da orelha baseado no formato ==
function getEarsColorImage(shape, color) {
  if (shape === 'AA') {
    // Formato 1 - Redondas
    return traitMapping.earsColorFormat1[color]?.img || "./Assets/Cor da Orelha/orelhaDefault1.png";
  } else {
    // Formato 2 - Pontudas
    return traitMapping.earsColorFormat2[color]?.img || "./Assets/Cor da Orelha/orelhaDefault2.png";
  }
}

// Ordem de renderização das partes do lobo (da parte de trás para a frente)
const renderOrder = ['fur', 'bodyShape', 'earsColor', 'earsShape', 'eyesColor', 'eyesShape', 'snoutShape'];

// Variável para armazenar o DNA atual
let currentDNA = null;

// == Função para gerar DNA consistente baseado nas características ==
function generateStableDNA(selectedGenes) {
  // Criar uma string única baseada nas seleções atuais
  const selectionString = JSON.stringify(selectedGenes);
  
  // Usar um hash simples para gerar DNA consistente
  let hash = 0;
  for (let i = 0; i < selectionString.length; i++) {
    const char = selectionString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Garante 32 bits
  }
  //Gera a sequência de DNA a partir do valor absoluto do hash
  return generateDNAFromSeed(Math.abs(hash));
}

// Gera uma sequência pseudo-aleatória de bases (A, T, C, G) a partir de uma seed numérica
function generateDNAFromSeed(seed) {
  const bases = ['A', 'T', 'C', 'G'];
  const dnaSequence = [];
  
// Gera um número pseudoaleatório determinístico baseado na sedd
// Math.sin(seed) cria um valor previsível para cada seed, e ao pegar só a 
// parte decimal obtemos um número entre 0 e 1. Isso garante que,
// usando a mesma seed, o resultado será sempre o mesmo.
  function seededRandom() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  // Gerar 14 bases (7 pares)
  for (let i = 0; i < 14; i++) {
    const randomIndex = Math.floor(seededRandom() * bases.length);
    dnaSequence.push(bases[randomIndex]);
  }
  
  return dnaSequence;
}

// == Sistema de Visualização do DNA ==
function generateDNAVisualization(selectedGenes){
  const dnaHelix = document.getElementById("dnaHelix");
  const geneInfo = document.getElementById("geneInfo");

  // Limpar visualizações anteriores
  dnaHelix.innerHTML = '';
  geneInfo.innerHTML = '';

  // Gerar DNA consistente
  currentDNA = generateStableDNA(selectedGenes);

  // Adicionar as fitas laterais da hélice
  const leftStrand = document.createElement('div');
  leftStrand.className = 'dna-strand left';

  const rightStrand = document.createElement('div');
  rightStrand.className = 'dna-strand right';

  dnaHelix.appendChild(leftStrand);
  dnaHelix.appendChild(rightStrand);

  // Número de pares
  const basePairs = 7;

  for (let i = 0; i < basePairs; i++) {
    const baseIndex = i * 2;
    const base1 = currentDNA[baseIndex];
    let base2;

    // Emparelhamento de bases (A-T, C-G)
    switch(base1) {
      case 'A': base2 = 'T'; break;
      case 'T': base2 = 'A'; break;
      case 'C': base2 = 'G'; break;
      case 'G': base2 = 'C'; break;
      default: base2 = 'A'; 
    }

    // Cria div do par de bases
    const basePair = document.createElement('div');
    basePair.className = 'base-pair';
    basePair.style.top = `${(i / (basePairs - 1)) * 100}%`;

    // Primeira base (esquerda)
    const nucleotide1 = document.createElement('div');
    nucleotide1.className = `nucleotide nucleotide-${base1.toLowerCase()}`;

    // Segunda base (direita)
    const nucleotide2 = document.createElement('div');
    nucleotide2.className = `nucleotide nucleotide-${base2.toLowerCase()}`;

    // Conector
    const connector = document.createElement('div');
    connector.className = 'connector';
    connector.style.width = '40%';
    connector.style.left = '30%';
    connector.style.top = '50%';
    connector.style.transform = 'translateY(-50%)';

    basePair.appendChild(nucleotide1);
    basePair.appendChild(connector);
    basePair.appendChild(nucleotide2);
    dnaHelix.appendChild(basePair);
  }

  // Gerar painel de informações dos genes
  geneInfo.innerHTML = `
    <h4>GENES SELECIONADOS</h4>
    <div class="dna-stats">
      <div class="stat-item">
        <span class="stat-label">Total de genes:</span>
        <span class="stat-value">${Object.keys(selectedGenes).length - 1}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Genes dominantes:</span>
        <span class="stat-value" id="dominantCount">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Genes recessivos:</span>
        <span class="stat-value" id="recessiveCount">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Sequência DNA:</span>
        <span class="stat-value">${currentDNA.join('')}</span>
      </div>
    </div>
  `;

  // Contagem de dominantes / recessivos
  let dominantCount = 0;
  let recessiveCount = 0;

  for(const [trait, gene] of Object.entries(selectedGenes)) {
    // Não mostrar o bodyShape já que é fixo
    if (trait === 'bodyShape') continue;
    if (gene === 'AA' || gene === 'AA - Azul' || gene === 'AA - Verde') {
      dominantCount++;
    } else if (gene === 'aa') {
      recessiveCount++;
    }

    // Cria item da lista de genes
    const geneItem = document.createElement('div');
    geneItem.className = 'gene-item';

    const geneName = document.createElement('span');
    geneName.className = 'gene-name';

    const formattedTraitName = trait.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('Shape', '')
        .replace('Color', ' Cor');

    geneName.textContent = formattedTraitName + ":";

    const geneValue = document.createElement('span');
    geneValue.className = 'gene-value';
    
    // Mostrar valor amigável para eyesColor
    if (trait === 'eyesColor') {
      if (gene === 'AA - Azul') {
        geneValue.textContent = 'Azul (AA)';
        geneValue.title = 'Gene dominante';
      } else if (gene === 'AA - Verde') {
        geneValue.textContent = 'Verde (AA)';
        geneValue.title = 'Gene dominante';
      } else {
        geneValue.textContent = gene;
        if (gene === 'aa') geneValue.title = 'Gene recessivo';
        else if (gene === 'Aa') geneValue.title = 'Gene heterozigoto';
      }
    } else {
      geneValue.textContent = gene;
      
      // Tooltip dominante / recessivo
      if (gene === 'AA') {
        geneValue.title = 'Gene dominante';
      } else if (gene === 'aa') {
        geneValue.title = 'Gene recessivo';
      } else if (gene === 'Aa') {
        geneValue.title = 'Gene heterozigoto';
      }
    }

    geneItem.appendChild(geneName);
    geneItem.appendChild(geneValue);
    geneInfo.appendChild(geneItem);
  }

  // Atualizar contadores
  document.getElementById('dominantCount').textContent = dominantCount;
  document.getElementById('recessiveCount').textContent = recessiveCount;
}   

// == Função de Geração do Lobo ==
function generateWolfWithGenetics() {
  // Limpar preview anterior
  const wolfPreview = document.getElementById("wolf-preview");
  wolfPreview.innerHTML = '';

  // Coletar seleções do usuário
  const selectedEarsShape = document.getElementById("earsShape").value;
  const selectedEarsColor = document.getElementById("earsColor").value;
  
  const selectedGenes = {
    bodyShape: "AA", // Valor fixo
    fur: document.getElementById("fur").value,
    earsColor: selectedEarsColor,
    earsShape: selectedEarsShape,
    eyesColor: document.getElementById("eyesColor").value,
    eyesShape: document.getElementById("eyesShape").value,
    snoutShape: document.getElementById("snoutShape").value
  };

  // Atualizar a visualização do DNA
  generateDNAVisualization(selectedGenes);

  // Renderizar cada parte do lobo na ordem correta
  renderOrder.forEach((trait, index) => {
    // Caso especial para earsColor - usar a função especial
    if (trait === 'earsColor') {
      const img = document.createElement('img');
      img.src = getEarsColorImage(selectedEarsShape, selectedEarsColor);
      img.alt = `Orelhas ${selectedEarsShape} - ${selectedEarsColor}`;
      img.id = `wolf-${trait}`;
      img.className = 'wolf-part';
      img.style.zIndex = (index + 1).toString();
      
      // Tratamento de erro ao carregar a imagem: usa uma opção de backup baseado no formato
      img.onerror = function() {
        console.error(`Erro ao carregar imagem: ${this.src}`);
        if (selectedEarsShape === 'AA') {
          this.src = "./Assets/Cor da Orelha/orelhaDefault1.png";
        } else {
          this.src = "./Assets/Cor da Orelha/orelhaDefault2.png";
        }
      };
      
      wolfPreview.appendChild(img);
    } 
    // Para outras características, usar o mapeamento normal
    else {
      const gene = selectedGenes[trait];
      const traitInfo = traitMapping[trait]?.[gene];
      
      if (traitInfo && traitInfo.img) {
        const img = document.createElement('img');
        img.src = traitInfo.img;
        img.alt = traitInfo.label;
        img.id = `wolf-${trait}`;
        img.className = 'wolf-part';
        img.style.zIndex = (index + 1).toString();
        
        img.onerror = function() {
          console.error(`Erro ao carregar imagem: ${traitInfo.img}`);
          // Backups genéricos para caso a imagem não exista
          if (trait === 'bodyShape') this.src = "./Assets/Corpo/corpoDefault.png";
          else if (trait === 'fur') this.src = "./Assets/Pelagem/pelagemDefault.png";
          else if (trait === 'earsShape') this.src = "./Assets/Formato da Orelha/formatoDaOrelha1.png";
          else if (trait === 'eyesColor') this.src = "./Assets/Cor dos Olhos/corDoOlhoDefault.png";
          else if (trait === 'eyesShape') this.src = "./Assets/Formato dos Olhos/formatoDoOlhoDefault.png";
          else if (trait === 'snoutShape') this.src = "./Assets/Focinho/focinhoDefault.png";
        };
        
        wolfPreview.appendChild(img);
      }
    }
  });
}

// Adicionar event listener para atualizar cores quando o formato mudar
document.getElementById('earsShape').addEventListener('change', function() {
  updateEarsColorOptions();
  // Gerar o lobo automaticamente quando mudar o formato
  generateWolfWithGenetics();
});

// Adicionar event listener apenas ao botão
document.getElementById('generateWolfBtn').addEventListener('click', generateWolfWithGenetics);

// Inicializar as opções de cor das orelhas ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  updateEarsColorOptions();
  generateWolfWithGenetics();
});