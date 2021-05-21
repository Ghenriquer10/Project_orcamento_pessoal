/*
    Na parte do javascript criamos primeiramente a classe a ser usada em nossa aplicação responsável por pegar todos os dados a serem gravados no localStorage.
    Com a classe Despesas() passamos os parâmetros que serão resgatados através da função cadastrarDespesa que é acionada com o onclick() no código HTML

*/

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor

    }

    /*
        Na própria classe Despesa() é verificado se todos os dados nos inputs disponíveis do HTML foram preenchidos, retornando false ou true para que sejam
        tomadas as decisões da janela modal
    */


    validarDados() {
        for (let i in this) {
            if (this[i] == null || this[i] == '' || this[i] == undefined) {
                return false
            }
        }
        return true
    }
}

/*

    A classe GravaId é resposável por gerar novos id's no localStorage, facilitando na persistência de ID's diferentes, pois caso não seja criada tal classe, os objetos despesas
    criados apenas sobreescreverão um ao outro

*/

class GravaId {

    /*
        Já nos atributos da classe GravaId, caso nunca tenha sido criado algúm o mesmo é criado através do construtor
    */

    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    /*
        O metodo gerandoProximoId() é chamado para recuperar qual Id foi usado na criação do objeto anterior e o adiciona +1 para ser retornado como novo Id no metodo
        gravarId.gravar()
    */

    gerandoProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    /*
        Quando o método  gravaId.gravar() é chamado, o mesmo recupera qual número de ID gerado naquele momento através da função da própria classe chamada gerandoProximoId()
        e o adiciona com os dados do objeto Depesa() passados pelo usuário, logo em seguida adiciona o id que será usado na próxima gravação de um objeto.
    */

    gravar(despesa) {
        let id = this.gerandoProximoId()
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
    }


    /*
        Com o metodo recuperaTodosOsRegistros() adicionado ao objeto GravaId, é possível fazer que uma variável, no caso
        despesas recebe um array
    */

    recuperaTodosOsRegistros() {

        let despesas = new Array()

        /*
            Para termos o controle de qual a quantidade certa de despesas a recuperar, usamos o id já criado no localStorage, esse
            que por sua vez já contém o valor do proximo id que será criado
        */
        let id = localStorage.getItem('id')

        /*
            Enquanto o i for menor que o Id para a criação da próxima despesa, o número do laço de i naquela repetição irá recuperar
            o objeto salvo no mesmo e adicionar ao array despesas através do push, caso seja null irá pular e passar para o próximo
        */

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)

        }

        // Aqui é retornado o array com todas as despesas para quem chamou o metodo

        return (despesas)

    }

    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperaTodosOsRegistros()

        console.log(despesa)
        // Ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        // Mês 
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        // Dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        // Tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //Descrição
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        // Valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return (despesasFiltradas)
    }


    removerId(id) {
        localStorage.removeItem(id)
    }
}

let gravaId = new GravaId()

/*

    Já na função cadastrarDespesa é por onde resgatamos os valores dos campos com dados inseridos pelo usuário 

*/

function cadastrarDespesa() {
    ano = document.getElementById('ano')
    mes = document.getElementById('mes')
    dia = document.getElementById('dia')
    tipo = document.getElementById('tipo')
    descricao = document.getElementById('descricao')
    valor = document.getElementById('valor')

    /*
        Aqui é onde instacimamos um novo objeto despesa a cada chamada da função, pegamos os dados dos campos e repassamos apenas os valores para a classe Despesas()
    */

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    /*
    
    Na chamada dessa função é verificado se todos os dados foram inseridos, se não, é chamado uma janela modal, disponível pelo Bootstrap, avisando ao usuário que
    há dados que não foram preenchidos, se sim, é chamada o método da classe GravarID() e em seguida acionada a janela modal de sucesso

    */

    if (despesa.validarDados() == true) {
        gravaId.gravar(despesa)

        /*
            Através do document é possível usar apenas uma janela modal do bootstrap
            e inserir elementos em classes e o que mostrar no HTML dependendo dequal ação tenha sido tomada
        */

        document.getElementById('exampleModalLabel').innerHTML = 'Sucesso!'
        document.getElementById('exampleModalLabel').className = "modal-title text-success"
        document.getElementById('mensagemTextoModal').innerHTML = 'Dados salvos com sucesso!'
        document.getElementById('botaoModal').className = "btn btn-success"
        document.getElementById('botaoModal').innerHTML = 'Fechar'
        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {
        document.getElementById('exampleModalLabel').innerHTML = 'Erro!'
        document.getElementById('exampleModalLabel').className = "modal-title text-danger"
        document.getElementById('mensagemTextoModal').innerHTML = 'Há dados que não foram preenchidos'
        document.getElementById('botaoModal').className = "btn btn-danger"
        document.getElementById('botaoModal').innerHTML = 'Fechar e corrigir'
        $('#modalRegistraDespesa').modal('show')
    }
}

/*
    Com a função carregaListaDespesa() é chamado o objeto gravaId com o seu método
    predefinido para a recuperação de todos os elementos salvos no localStorage 
*/

function carregaListaDespesa(despesas = Array(), filtro = false) {

    // Aqui a variável despesas recebe um array por default
    // E após receber o array o mesmo recebe todos os elementos salvos através de indices
    if (despesas.length == 0 && filtro == false) {
        despesas = gravaId.recuperaTodosOsRegistros()
    }

    /*
        Aqui fazemos com que uma variável seja respopsável pelo elemento do html chamado tbody
    */
    let listaDespesa = document.getElementById('listaDespesa')
    listaDespesa.innerHTML = ''

    /*
    <tr>
        <td>23/08/2018</td>
        <td>Alimentação</td>
        <td>Compras mês</td>
        <td>444.75</td>
    </tr>
    */

    /*
        Aqui fazemos que a variável linha receba o listaDespesa e que com que para cada elemento recuperado das despesas salvas
        no localStorage seja criado uma linha através do inserRow()
    */
    despesas.forEach(function (d) {
        let linha = listaDespesa.insertRow()

        /*
            E após cada linha criada, seja criada também uma nova célula (coluna) recendo os elementos em texto
        */

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // Criação do botão de excluir

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class= "fas fa-times"></i>'
        btn.id = `id_despesas_${d.id}`
        btn.onclick = function () {
            let id = this.id.replace('id_despesas_', '')
        
        

            gravaId.removerId(id)
            document.getElementById('exampleModalLabel').innerHTML = 'Sucesso!'
            document.getElementById('exampleModalLabel').className = "modal-title text-success"
            document.getElementById('mensagemTextoModal').innerHTML = 'Dados excluidos com sucesso!'
            document.getElementById('botaoModal').className = "btn btn-success"
            document.getElementById('botaoModal').innerHTML = 'Fechar'
            $('#modalRegistraDespesa').modal('show')


            
            
            function minhaFuncao() {
                let timeout = setTimeout(recarregar, 3000)
            }
            
            function recarregar() {
                window.location.reload()
            }

            minhaFuncao()
        }
        linha.insertCell(4).append(btn)

        console.log(d)

    });

}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = gravaId.pesquisar(despesa)

    this.carregaListaDespesa(despesas, true)

}