const toCurrency = price => {
    return new Intl.NumberFormat('ru-Ru', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const $cart = document.querySelector('#cart')

if($cart) {
    $cart.addEventListener('click', event => {
        if(event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/cart/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(cart => {
                    if (cart.courses.length) {
                        const html = cart.courses.map(c => {
                            return `
                                <tr>
                                    <td>${c.title}</td>
                                    <td>${c.count}</td>
                                    <td>
                                      <button class="btn btn-small js-remove" data-id="${c.id}">Remove</button>
                                    </td>
                                  </tr>
                            `
                        }).join('')
                        $cart.querySelector('tbody').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(cart.price)
                    } else {
                        $cart.innerHTML = '<p>Cart is empty</p>'
                    }
                })
        }

    })
}

// function varLetConst() {
//     console.log(varVariable)
//     var varVariable = 'Var Value'
//
//     console.log(letVariable, constVariable)
//     let letVariable = 'Let Value'
//     const constVariable = 'const Value'
//     console.log(letVariable, constVariable)
//
//     for(var varIndex = 0; varIndex < 2; varIndex++) continue
//     console.log('varIndex', varIndex)
//     for(let letIndex = 0; letIndex < 2; letIndex++) continue
//     console.log('letIndex', letIndex)
// }
//
// function falsyValue() {
//     console.log('false', isTruthyOrFalsy(false))
//     console.log('null', isTruthyOrFalsy(null))
//     console.log('0', isTruthyOrFalsy(0))
//     console.log('Not 0 Number', isTruthyOrFalsy(123456))
//
//     console.log('Empty String', isTruthyOrFalsy(''))
//     console.log('Not Empty String', isTruthyOrFalsy('Not Empty String'))
//
//     console.log('Empty Array', isTruthyOrFalsy([]))
//     console.log('Not Empty Array', isTruthyOrFalsy([1, 2]))
//
//     console.log('Empty Object', isTruthyOrFalsy({}))
//     console.log('Not Empty Object', isTruthyOrFalsy({name: 'Name'}))
//
//     console.log('NaM', isTruthyOrFalsy(NaN))
//
//     function isTruthyOrFalsy(value) {
//         if (value) return 'is truthy'
//         return 'is falsy'
//     }
// }
//
// falsyValue