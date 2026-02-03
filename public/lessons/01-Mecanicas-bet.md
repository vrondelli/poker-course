# Para entender as mecânicas de bet, primeiro precisamos compreender dois conceitos fundamentais: **Range Advantage** (Vantagem de Range) e **Nut Advantage** (Vantagem de Nuts).

### O que é vantagem de range (Range Advantage) e vantagem de nuts (Nut Advantage)?

1. **Range Advantage:** Ocorre quando o conjunto total de mãos possíveis de um jogador (seu range) possui maior equidade (chance de ganhar) e força média superior à do range do oponente em um determinado board.

2. **Nut Advantage:** Ocorre quando um jogador possui uma proporção maior de mãos extremamente fortes (o "nuts", como trincas, sequências ou flushes) em seu range do que o oponente em um determinado board.

Além disso, utilizamos categorias para agrupar tipos de boards, o que facilita a criação de uma estratégia de bet consistente.

### Categorias de Board

**Por Naipes:**

1. **Rainbow:** O board não tem nenhum naipe repetido. (Ex: [cards: As 7h 2d])
2. **Two-tone (Flush Draw):** Possui 2 cartas do mesmo naipe. (Ex: [cards: As 7s 2d])
3. **Monotone:** Todas as cartas do board são do mesmo naipe. (Ex: [cards: As 7s 2s])

**Por Pareamento:**

1. **Unpaired:** O board não tem par. (Ex: [cards: A♠ 7♥ 2♦])
2. **Paired:** O board tem um par. (Ex: [cards: A♠ A♥ 2♦])
3. **Trips:** O board tem 3 cartas do mesmo valor. (Ex: [cards: A♠ A♥ A♦])

**Por Conectividade:**

Refere-se à possibilidade de o board formar sequências.

**Ranking das Cartas:**

1. **High cards (H):** Cartas altas (A, K, Q, J).
2. **Middle cards (M):** Cartas médias (T, 9, 8, 7).
3. **Low cards (L):** Cartas baixas (6, 5, 4, 3, 2).

---

### Representação Agrupada de Boards

Podemos combinar essas características para descrever boards de forma precisa:

1. **HML:** High, Middle, Low.
2. **HLL:** High, Low, Low.
3. **MLL:** Middle, Low, Low.
4. **MML:** Middle, Middle, Low.

Adicionando naipes e pareamento, temos descrições como:

1. **HML Monotone:** (Ex: [cards: K♠ 8♠ 3♠])
2. **HML Two-tone:** (Ex: [cards: K♠ 8♠ 3♦])
3. **HML Rainbow:** (Ex: [cards: K♠ 8♥ 3♦])
4. **HHL Paired:** (Ex: [cards: K♠ K♥ 3♦])

**Categorias Gerais (não mutuamente excludentes):**

1. **Dry / Secos:** Boards com poucas possibilidades de draws (Ex: [cards: A♠ 7♥ 2♦], [cards: K♠ 8♥ 3♦]).
2. **Wet / Molhados:** Boards com muitas possibilidades de draws (Ex: [cards: 8♠ 7♠ 6♦], [cards: Q♠ J♠ 9♦]).
3. **Dynamic / Dinâmicos:** Boards onde a carta "nuts" pode mudar frequentemente no turn/river (Ex: [cards: 9♠ 8♠ 7♦] - qualquer T, J, 6 ou carta de espadas muda a força relativa das mãos).
4. **Static / Estáticos:** Boards onde o "nuts" dificilmente muda (Ex: [cards: A♠ A♥ 7♦],  [cards: K♠ 8♠ 3♠]).

**Exemplos combinados:**

1. **Seco e Estático:** [cards: K♠ 7♥ 2♦] rainbow.
2. **Molhado e Estático:** [cards: J♠ 5♠ 2♠] monotone (apesar de molhado por ser monotone, quem tem o flush já tem uma mão muito forte definida).
3. **Molhado e Dinâmico:** [cards: 8♠ 7♠ 6♦] two-tone.
4. **Seco e Dinâmico:** [cards: A♠ A♥ 8♦] (embora pareça estático, um full house define a mão, mas draws podem não ser tão óbvios). *Nota: Boards pareados geralmente são considerados estáticos, "Seco e Dinâmico" é uma categoria rara, geralmente refere-se a boards rainbow com pouca conectividade mas que cartas altas podem mudar o topo do range.*

---

# Pratique Agora

Já entende os conceitos teóricos? Agora é hora de treinar seu "olho" no nosso simulador de boards.

> [!TIP]
> Tente bater seu recorde de tempo médio mantendo 100% de acerto!

[👉 Ir para o Flop Trainer](/trainer.html)

# Como funciona a mecânica de bet na teoria?

## O que afeta a frequência de bet?

1. **Vantagem de Range (Range Advantage):** É o principal indutor da frequência. Quem tem a vantagem de range deve betar com mais frequência (agressividade).
2. **Elasticidade do Range do Oponente:** Quanto mais "elástico" for o range do oponente (ou seja, ele folda mãos marginais diante de uma aposta), maior pode ser nossa frequência de bet com blefes. Se ele for "inelástico" (paga com tudo), nossa frequência de blefe deve cair.

## O que afeta o tamanho do bet (Sizing)?

1. **Vantagem de Nuts (Nut Advantage):** Determina o **tamanho** da aposta. Quanto maior a quantidade de combos de mãos muito fortes (nuts) você tem em relação ao oponente, maior pode ser o seu sizing (Overbets, Pot-size).

2. **Proteção de Equity:** A presença de muitas mãos médias em relação ao topo do nosso range incentiva sizes menores. Se usarmos um size muito grande apenas com o topo, nosso range fica polarizado e transparente. Usar um size menor permite apostar com o topo e também com mãos de valor médio por proteção/valor magro, dificultando a leitura do vilão.

3. **Inelasticidade:** Se a chance do oponente foldar não muda muito conforme o tamanho da aposta (ele paga tanto 30% quanto 60% com o mesmo range), devemos usar sizes maiores com nossas mãos de valor para extrair o máximo.

4. **Fold Equity:** O quanto de equidade negamos ao fazer o oponente foldar. Em boards onde o oponente pode ter muitos "live cards" ou draws fracos, betar maior nega essa equidade. Se ele tem poucos outs ou já está drawing dead, não precisamos apostar tão forte para negar equidade.

5. **Realização de Equidade:** Se nossa mão tem baixa chance de realizar a equidade (ex: jogar fora de posição com mãos frágeis), podemos usar sizes maiores para tentar "comprar" a realização ou negar a do oponente imediatamente. Isso é comum quando o vilão tem Vantagem de Range, mas nós temos a Vantagem de Nuts (Polarized vs Condensed ranges). 


# Como montar uma estratégia de bet no Flop?

Primeiro, categorizamos o board. Podemos usar categorias gerais (Seco/Estático, Molhado/Dinâmico) ou específicas (High-Low-Low Rainbow). Quanto mais específica a categoria e a leitura do range, mais precisa (e complexa) será a estratégia, aumentando o EV.

Geralmente, simplificamos para 2 ou 3 tamanhos de aposta padrão para cobrir a maioria das situações:
- **Size Pequeno:** 20% a 33% do pot (1/5 a 1/3).
- **Size Médio/Grande:** 66% a 75% do pot (2/3 a 3/4).
- **Overbet:** 125% ou mais (para situações de extrema vantagem de nuts).

**Diretrizes Simplificadas:**
1. **Boards Dry/Static (Vantagem de Range do Agressor):** Alta frequência de aposta, Size Pequeno (ex: 33%).
2. **Boards Wet/Dynamic (Nuts muda fácil):** Frequência polarizada, Size Maior (ex: 66%+) para cobrar de draws e proteger.
3. **Boards HML (High-Middle-Low):**
    - **Rainbow:** Size Pequeno a Médio (33%).
    - **Two-tone:** Size Médio a Grande (50-66%) por conta dos draws.
    - **Monotone:** Size Pequeno (25-33%) pois a equidade muda drasticamente e queremos controlar o pote.

Ao montar uma estratégia devemos fazer algumas perguntas:

1. **Qual o meu objetivo ao selecionar certo size e em qual princípio estou me baseando?**
    - Ex: se eu escolher uma estratégia de bet grande ou check com todo meu range, eu tenho 40% de fold equity, e na parte do range do vilão que continua eu tenho vantagem de nuts.

2. **O quão balanceado eu devo deixar meu range e o quanto a população é capaz de explorá-lo?**
    - Ex: Qual a probabilidade do vilão perceber o meu desequilíbrio (relação entre valor e blefes no range de alguma ação, como eu divido meu range entre bet e check) e se ele consegue reagir corretamente? Por exemplo, se tivermos um range de bet em determinada posição, qual a chance do vilão aumentar a frequência de check-raise? Se ele aumentar o range de call, como ficará nosso range na próxima street? Se ele aumentar o range de fold, como ficará nosso range na próxima street?

3. **Devo usar uma estratégia polarizada ou linear?**
    - **Devo polarizar meu range?**: Um range perfeitamente polarizado é quando o vilão fica indiferente entre dar call e fold. Então, ao polarizar, é necessário ter uma boa fold equity.
    - **Preciso proteger o meio do meu range?**: Tenho mãos de valor médio que conseguem extrair valor do vilão?

4. **A população comete mais erros contra qual tipo de estratégia?**
    - Ex: É importante se perguntar se o vilão irá foldar mais mãos do que deveria (overfold) ou pagar mais mãos do que deveria (overcall). Assim você consegue calibrar frequência e sizing para forçar o vilão numa árvore de decisão que ele não é capaz de lidar. Se ele está overfolding, podemos ajustar a frequência, adicionando mais blefes e diminuindo o sizing. Se ele está overcalling, podemos ajustar a frequência, diminuindo os blefes e aumentando o sizing.

# Exercicio

Baseado nos conceitos que vimos, monte uma estratégia, com 2 ou 3 tamanhos de size, na situação **BB (Hero) vs CO (Villain)**.

**Cenário:** Houve um **Open Raise do Cutoff (CO)** e uma **3-Bet do Big Blind (BB)**. O CO pagou.
As imagens abaixo mostram os **Ranges no Flop**:

| Range BB (3-Bettor) | Range CO (Caller) |
| :---: | :---: |
| <img src="/images/range-flop-BB(BBxCO-3bet).png" width="400"> | <img src="/images/range-flop-CO(BBxCO-3bet).png" width="400"> |

1. **A-High Rainbow:** (Ex: [cards: A♠ 8♥ 3♦])
2. **MML Two-tone:** (Ex: [cards: 9♠ 8♠ 4♦])
3. **MLL Monotone:** (Ex: [cards: 7♠ 4♠ 2♠])
4. **HHL Connected:** (Ex: [cards: K♠ Q♥ 3♦])

