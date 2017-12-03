//Função inicial de Huffman
function Huffman(){
    var txt = document.getElementById("texto").value;
    var freq = {};
    var aux = [];
    for (var i=0; i<txt.length;i++) {
        var c = txt.charAt(i);
        if (freq[c]) {
           freq[c]++;
        } else {
           freq[c] = 1;
           aux.push(c);
        }
    }
    var tuplas = [];
    for (var char in freq)
          tuplas.push([char, freq[char]])
    var s = tuplas.sort(function(a, b) {return b[1] - a[1]});
    var graph = {nodes:[], edges:[]};
    var codes = [];
    var tree = createTreeHuffman(s, graph, "Huffman");
    getCodigosFolhas(tree.raiz, codes);
    codes.sort(function(a, b){
            if (a[0] < b[0]) {
                return 1;
            }
            if (a[0] > b[0]) {
              return -1;
            }
            return 0;
    });
    tuplas.sort(function(a, b){
            if (a[0] < b[0]) {
                return 1;
            }
            if (a[0] > b[0]) {
              return -1;
            }
            return 0;
    });
    
    aux = [];
    for(i = 0; i < codes.length; i++){
        aux.push([tuplas[i][0], tuplas[i][1], codes[i][1]]);
    }
  
    aux.sort(function(a, b){
            if (a[1] < b[1]) {
                return 1;
            }
            if (a[1] > b[1]) {
              return -1;
            }
            return 0;
    });
  
    document.getElementById("tableHuffman").appendChild(criarTabela([ "Caracter", "Frequência","Código"], aux));
    document.getElementById('textoComprimidoHuffman').innerHTML = "Texto Comprimido: " + comprimir(txt, codes);
}

//Função inicial de Shannon-Fano
function Shannon(){
    var txt = document.getElementById("texto").value;
    var freq = {};
    var aux = [];
    for (var i=0; i<txt.length;i++) {
        var c = txt.charAt(i);
        if (freq[c]) {
           freq[c]++;
        } else {
           freq[c] = 1;
           aux.push(c);
        }
    }
    for (i=0; i<aux.length;i++) {
        freq[aux[i]] = (freq[aux[i]]/txt.length).toFixed(3);
    }
    var tuplas = [];
    for (var char in freq)
          tuplas.push([char, freq[char]])
    var s = tuplas.sort(function(a, b) {return b[1] - a[1]});
    var graph = {nodes:[], edges:[]};
    var codes = [];
    var tree = createTree(s, graph, "Shannon");
  
    getCodigosFolhas(tree.raiz, codes);
    aux = [];
    for(i = 0; i < codes.length; i++){
        aux.push([tuplas[i][0], tuplas[i][1], codes[i][1]]);
    }
  
    console.log(aux);
    document.getElementById("tableShannon").appendChild(criarTabela([ "Caracter", "Porcentagem","Código"], aux));
    document.getElementById('textoComprimidoShannon').innerHTML = "Texto Comprimido: " + comprimir(txt, codes);
}

//No da arvore de Huffman
function NoHuffman (caracter, codigo, frequencia, esquerda, direita){ 
    this.caracter   = caracter;
    this.codigo    = codigo;
    this.frequencia = frequencia;
    this.esquerda   = esquerda; 
    this.direita  = direita; 
    this.getCaracter   = getCaracter;
    this.insere = insere;
}

//No da arvore de Shannon-Fano
function No (caracter, codigo, esquerda, direita){ 
    this.caracter   = caracter;
    this.codigo    = codigo;
    this.esquerda   = esquerda; 
    this.direita  = direita; 
    this.getCaracter   = getCaracter;
    this.insere = insere;
} 

//Configurações iniciais da arvore
function configuracaoGrafo(g, s){
    s = new sigma({
        graph : g,
        container: 'graph_draw_' + s,
        settings :{
            nodeColor : 'default',
            edgeColor : 'default',
            defaultNodeColor : '#ffffff',
            defaultEdgeColor : '#ffffff',
            defaultFontColor: '#ffffff',
            defaultLabelColor: '#ffffff',
            mouseEnabled: false,
            autoResize: true
        }
    });
}

//Função para criar e preencher dinamicamente a tabela de frequencias
function criarTabela(conteudo, c) {
    var tabela = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var t, texto;
    var tr = document.createElement("tr");
    for(var o = 0; o < conteudo.length; o++){
        t = document.createElement("th");
        texto=document.createTextNode(conteudo[o]);
        t.appendChild(texto);
        tr.appendChild(t);
    }

    thead.appendChild(tr);

    tabela.appendChild(thead);
    for(var i = 0; i < c.length; i++){
        var td = document.createElement("tr");
        for(var j = 0; j < c[i].length; j++){
            t = document.createElement("td");
            texto = document.createTextNode(c[i][j]);
            t.appendChild(texto);
            td.appendChild(t);
        }
        tbody.appendChild(td);
    }

    tabela.appendChild(tbody);
    return tabela;
}

//Cria e insere os valores na arvore de Huffman
function createTreeHuffman(freq, graph, s){
    var a, b;
    var i =0;
    var aux = [];
    while(i < freq.length){
        aux.push(new NoHuffman(freq[i][0], null, freq[i][1],null, null));
        i++;
    }
    
    while(aux.length > 1){
        a = aux.pop();
        b = aux.pop();
        a.codigo = 0;
        b.codigo = 1;
        var novoNo = new NoHuffman(b.caracter + a.caracter, null, a.frequencia + b.frequencia, a, b);
        aux.push(novoNo);
        aux.sort(function (a, b) {
            if (a.frequencia < b.frequencia) {
                return 1;
            }
            if (a.frequencia > b.frequencia) {
              return -1;
            }
            return 0;
          });
    }
  
    var tree = new BST();
    tree.raiz = aux[0];
    console.log(tree.raiz);
  
    buildTreeJSON(tree.raiz, graph);
    configuracaoGrafo(graph, s);
    return tree;  
}

//Cria arvore de Shannon-Fano
function createTree(freq, graph, s){
    var tree = new BST();
    var root_name = "";
    for(var i = 0; i < freq.length; i++){
        root_name = root_name.concat(freq[i][0]);
    }
    var rootNode = new No(root_name, null, null, null);
    tree.raiz = rootNode;
    tree.raiz.insere(freq);
    
    console.log(tree.raiz);
    buildTreeJSON(tree.raiz, graph);
    configuracaoGrafo(graph, s);
  
    return tree;
}

//get Caracter associado ao nó
function getCaracter() { 
    return this.caracter; 
} 

//Inicializa arvore com raiz vazia
function BST() { 
    this.raiz = null;
}

//Desce na arvore pegando atribuindo o codigo dos nos folhas
function getCodigosFolhas(no, c, code="") {
    if(no.esquerda != null) {
        getCodigosFolhas(no.esquerda, c, code.concat("0"));
    }
    if(no.direita != null) {
        getCodigosFolhas(no.direita, c, code.concat("1"));
    }
    if(no.esquerda == null && no.direita == null) {
        c.push([no.getCaracter(), code]);
    }
}

//Insere os nós na arvore de Shannon-Fano de cima para baixo
function insere(freq){
    var aux;
    var caracteres = freq;
    var total = 0;
    for(var i=0;i<caracteres.length;i++){
        total+=parseFloat(caracteres[i][1]);
    }
    
    var soma = parseFloat(caracteres[0][1]);
    var meio = total/2;
    var j = 1;
    for(j=1; soma + parseFloat(caracteres[j][1]) <= meio; j++){
        soma += parseFloat(caracteres[j][1]);
    }
  
    var slice = j;
    var nome = "";
  
    aux = freq.slice(0, slice);
    for(var i = 0; i < aux.length; i++){
        nome = nome.concat(aux[i][0]);
    }
    this.esquerda = new No(nome, 0, null, null);
    if(aux.length>1)
        this.esquerda.insere(aux);
    nome = "";
    aux = freq.slice(slice, freq.length);
    for(i=0; i<aux.length; i++){
        nome = nome.concat(aux[i][0]);
    }
    this.direita = new No(nome, 1, null, null);
    if(aux.length > 1)
        this.direita.insere(aux);
}

//Constroi o modelo de arvore JSON para ser desenhado pela biblioteca Sigma JS
function buildTreeJSON(no, graph, x=0, y=0, dx=0.2, dy=0.2){
    var src = (x+dx)+(y+dy);
    graph.nodes.push({id: no.getCaracter(),
                      label: no.getCaracter(),
                      x: x,
                      y: y,
                      size: 3}
    );
    if(no.esquerda != null) {
        var esquerdax = (x+(dx*-1))-5;
        var esquerday = (y+dy)+5;
        buildTreeJSON(no.esquerda, graph, esquerdax, esquerday, dx-1, dy-1);
        graph.edges.push({id: "el_" + no.getCaracter(),
                          source: no.getCaracter(),
                          target: no.esquerda.getCaracter()}
        );
    }
    if(no.direita != null) {
        var direitax = (x+dx)+5;
        var direitay = (y+dy)+5;
        buildTreeJSON(no.direita, graph, direitax, direitay, dx-1, dy-1);
        graph.edges.push({id: "er_" + no.getCaracter(),
                          source: no.getCaracter(),
                          target: no.direita.getCaracter()}
        );
    }
}

//Transforma o texto em código utilizando os códigos gerados para cada caracter
function comprimir(caracter, codigos){
    var stringFinal = "";
    var cod = {};
    
    for(var i=0;i<codigos.length;i++){
        cod[codigos[i][0]] = codigos[i][1];
    }
    
    for(i=0; i < caracter.length; i++){
        stringFinal += " " + cod[caracter[i]];
    }
    return stringFinal;
}