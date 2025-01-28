const inputText = document.querySelectorAll('input[type="text"]')
const checkbox = document.querySelector('input[type="checkbox"]')
const form = document.querySelector("form")
const main = document.getElementById("sorter")

// Selecionando cada input separadamente para capturar os dados
const numbersAmount = document.getElementById("number")
const inputMin = document.getElementById("from")
const inputMax = document.getElementById("to")

// Validação do input
inputText.forEach((input) => {
  input.addEventListener("input", (event) => {
    // Remove caracteres que não são números
    let value = event.target.value.replace(/[^0-9]/g, "")
    // Atualiza o valor do input
    event.target.value = value.trim()
  })
})

// Evento de 'submit' do formulário
form.onsubmit = (event) => {
  event.preventDefault() // Previne o envio do formulário

  // Objeto que vai guardar os dados do sorteio
  const draw = {
    amount: parseInt(numbersAmount.value),
    inputMin: parseInt(inputMin.value),
    inputMax: parseInt(inputMax.value),
  } // O parseInt é para transformar strings em números inteiros

  // Condição de existência do sorteio. Se o número inicial for maior ou igual ao número final, o sorteio não pode ser feito
  if (draw.inputMin >= draw.inputMax) {
    alert("O número inicial deve ser menor que o número final")
    return
  }

  // Condição de existência do sorteio. Se a quantidade de números for maior que o intervalo de números, o sorteio não pode ser feito
  if (draw.amount > draw.inputMax - draw.inputMin) {
    alert("O número de sorteios não pode ser maior que o intervalo de números")
    return
  }

  var spaceSample = []

  // Adiciona os valores dos inputs que determinam o espaço amostral ao array spaceSample
  for (let i = draw.inputMin; i <= draw.inputMax; i++) {
    spaceSample.push(i)
  }

  // Executa a função do sorteio
  sortNumbers(draw, spaceSample)
}

// Variável que vai apresentar os números de quantidade de resultados sorteados
let execute = 0

// Função que realizará o sorteio, em parênteses estão os parâmetros capturados para essa função, sendo "draw" os valores do objeto e "spaceSample" os valores do array
function sortNumbers(draw, spaceSample) {
  try {
    // Removendo conteúdo do main
    main.removeAttribute("id")
    main.innerHTML = ""

    // Adcionando a div que contem os itens do sorteio
    const results = document.createElement("div")
    results.classList.add("results")

    // Criando a div do titulo que contem um h3 e span no caso de haver mais de um sorteio e todos linkas no append
    const resultInfo = document.createElement("div")
    resultInfo.classList.add("resultsInfo")

    const title = document.createElement("h3") // Cria um elemento <h3>
    title.textContent = "RESULTADO DO SORTEIO" // Adiciona o texto ao <h3>

    const subTitle = document.createElement("span")
    execute++ // Incrementa a variável execute
    subTitle.textContent = `${execute}º RESULTADO`

    resultInfo.append(title, subTitle)

    const animatedNumber = document.createElement("div")
    animatedNumber.classList.add("resultsNumber")

    results.append(resultInfo, animatedNumber)
    main.append(results)

    // Const que realizará o sorteio
    const sortedNumbers = drawNumbers(draw.amount, spaceSample)

    // Variável que auxiliará na captura dos números sorteados
    let i = 0

    // Função que irá exibir os números sorteados
    function showSortedNumbers() {
      // condição de existência para sortear novamente
      if (i < sortedNumbers.length) {
        // Variável que irá armazenar o número sorteado
        const numberSorted = document.createElement("span")
        numberSorted.classList.add("text-animation")
        numberSorted.textContent = sortedNumbers[i] // O conteúdo dela será o número sorteado que estará, nesse momento, na variável "i"

        // Criando a div da animação
        const animation = document.createElement("div")
        animation.classList.add("bg-animation")
        animation.append(numberSorted)
        animatedNumber.append(animation)
        i++

        setTimeout(showSortedNumbers, 1700) // O tempo de espera é de 3.5 segundos
      } else {
        // Criando o botão "sortear novamente" somente após os números sorteados serem exibidos
        const button = document.createElement("button")
        button.classList.add("appear-button")
        button.innerHTML = `SORTEAR NOVAMENTE <img src="./assets/replay.svg" alt="imagem de um replay button" />`

        // Um pequeno atraso antes de mudar a opacidade para 1
        setTimeout(() => {
          button.style.opacity = 1
        }, 50) // Atraso pequeno para permitir que o botão seja renderizado antes de mudar a opacidade

        // Evento para sortear novamente
        button.onclick = () => {
          // Função que irá resetar a página
          main.innerHTML = ""
          sortNumbers(draw, spaceSample)
        }

        // Add o button ao main
        main.append(button)
      }

      // Executa a função que exibe os números com um pequeno atraso
    }

    setTimeout(showSortedNumbers, 500)
  } catch (error) {
    alert("Não foi possível realizar o sorteio")
    console.log(error)
  }
}
// Função que sorteará os números
function drawNumbers(amount, spaceSample) {
  // Constante que irá capturar os números sorteados
  const sortedNumbers = []
  // Cópia para não modificar o array original, que poderá ter um novo sorteio
  const copySpaceSample = [...spaceSample]

  // Sorteando números únicos enquanto o comprimento do array de números sorteados for menor que a quantidade desejada de números sorteados
  while (sortedNumbers.length < amount) {
    // Essa constante realiza uma operação matemática que multiplica valores do espaço amostral transformando-os em casas decimais e os arredondando para o valor inteiro mais próximo (Realizado pelo math.floor)
    const random = Math.floor(Math.random() * copySpaceSample.length)
    // Seleciona um número sorteado e o adiciona no array de números sorteados
    const selectedNumber = copySpaceSample[random]
    sortedNumbers.push(selectedNumber)

    // Se o usuário não desejar repetir números, essa condição retira o número já exibido do array
    if (checkbox.checked) {
      copySpaceSample.splice(random, 1)
    }
  }
  // Retorna o array de números sorteados
  return sortedNumbers
}
