let cart = [] //é o nosso carrinho de compra

let modalQt = 1

let modalKey = 0

const c = (el) => document.querySelector(el)

const cs = (el) => document.querySelectorAll(el);

//listagem das pizzas

pizzaJson.map((item, index) => {

    let pizzaitem = c('.models .pizza-item').cloneNode(true);


    pizzaitem.setAttribute('data-key', index);
    pizzaitem.querySelector('.pizza-item--img img').src = item.img;
    pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaitem.querySelector('a').addEventListener('click',(e) => { // é um evento de clique

        e.preventDefault(); //significa: previna a ação padrão, que no caso é a de recarregar a pagina quando você clica
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // significa: ache o elemento mais próximo do "a" que tenha a class "piza-item" e coloque o "data-key"

        modalQt = 1;
        modalKey = key

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => { // forEach =  para cada um dos itens ele vai rodar uma função           
            
            if(sizeIndex == 2){

                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML= pizzaJson[key].sizes[sizeIndex]

        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0; //vai deixar a tela opoca de forma que n vamos conseguir ver ela
        c('.pizzaWindowArea').style.display = 'flex' // vai aparecer uma tela quando clicar (essa tela não aparecia pq estava bloqueada no css)

        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1; //após dois segundos a tela vai aparecer pois nós aumentamos a opacidade dela, é como se fosse um efeito de transição
        }, 1000);

    });


    c('.pizza-area').append(pizzaitem);

});


// eventos do modal (é a aba que aparece para selecionar a pizza tamanho e quantidade)

function closeModal(){

    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);

}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {

item.addEventListener('click', closeModal)


});


c('.pizzaInfo--qtmais').addEventListener('click', () =>{ //botão de adcionar pizza
    
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

})

c('.pizzaInfo--qtmenos').addEventListener('click', () =>{ //botão de retirar pizza

    if(modalQt > 1){

        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
        
        }

})

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {

    size.addEventListener('click', (e) =>{

        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')

    });

});

c('.pizzaInfo--addButton').addEventListener('click', () =>{

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))

    console.log(`modalkey: ${modalKey}`)

    let identifider = pizzaJson[modalKey].name + '|tamanho:' + size; //calabreza|tamanho:grande

    let indiceDaPizzaAdicionada = cart.findIndex((pizza) => pizza.identifeider == identifider);

    if(indiceDaPizzaAdicionada > - 1) {

        cart[indiceDaPizzaAdicionada].qt += modalQt;

    } else {

        cart.push({
            identifider,
            id:pizzaJson[modalKey].id,
            size,     // Qual o tamanho?
            qt:modalQt     // Qual pizzas?

        })
    }

    updateCart();
    closeModal();

});

c('.menu-openner span').addEventListener('click', () => {

    if (cart.length > 0){

    c('aside').style.left = '0' // no zero ele aparece, no 100 ele some

}
})

c('.menu-closer').addEventListener('click', () => {

    c('aside').style.left = '100vw'// no zero ele aparece, no 100 ele some


})


function updateCart(){

    c('.menu-openner span').innerHTML = cart.length; //quando atualizar o carrinho, ele vai deixar de ser zero e passar para a quantidade desejada

    if(cart.length>0){

        c('aside').classList.add('show'); // se tiverem itens no carrinho ele vaia aparecer

        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart){

            let pizzaitem = pizzaJson.find( (item) => item.id == cart[i].id);

            subtotal += pizzaitem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSizeName;

            switch(cart[i].size){

                case 0:

                    pizzaSizeName = 'P'

                break;

                case 1:

                pizzaSizeName = 'M'

                break;

                case 2:

                pizzaSizeName = 'G'

                break;

            }

            let pizzaName = `${pizzaitem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaitem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{

            if (cart[i].qt > 1){

                cart[i].qt --;

            } else {

                cart.splice (i,1);
            }

            updateCart()


            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{

                cart[i].qt++;

                updateCart()
                
            })


            c('.cart').append(cartItem)

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML= `R$ ${subtotal.toFixed(2)}`//last-child é para pegar o último item
        c('.desconto span:last-child').innerHTML= `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML= `R$ ${total.toFixed(2)}`

    } else {

        c('aside').classList.remove('show') //caso contrário ele irá remover os carrinhos
        c('aside').style.left = '100vw'
    }

}

