import React, { Component } from 'react';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    // constructor(props) {
    //     super(props)
    //     this.state = {


    //     }
    // }
    state = {

        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-b5173.firebaseio.com/ingredients.json')
        .then(response => {
             this.setState({ingredients: response.data});
        })
        .catch(error => {
           this.setState({error: true})
        });
    }

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ purchaseable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCounted = oldCount + 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updateCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updateIngredients });
        this.updatePurchaseState(updateIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updateCounted = oldCount - 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updateCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updateIngredients });
        this.updatePurchaseState(updateIngredients);

    }
    purshaseHandler = () => {
        this.setState({ purchasing: true })
    }
    purshaseCancleHandler = () => {
        this.setState({ purchasing: false })
    }
    purchaseContinueHandler = () => {
        //alert('You continue !')
        this.setState({loading:true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Ajla Bise',
                address: {
                    street: 'test',
                    zipCode: '124578',
                    conutry: 'BiH'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading:false, purchasing: false});
            })
            .catch(error => {
                this.setState({loading:false, purchasing:false});
            });
    }


    render() {

        const disableInfo = {
            ...this.state.ingredients
        };

        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }

        let orderSummary = null;    
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
           
        let burger = this.state.error ? <p>ingredients can't be loaded.</p> : <Spinner/>

        if(this.state.ingredients)
        {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purshaseHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>
                
            );
            orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice.toFixed(2)}
            purchaseContinued={this.purchaseContinueHandler}
            purshaseCanclled={this.purshaseCancleHandler}
        />
        }
        if(this.state.loading) {
            orderSummary = <Spinner/>
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modelClosed={this.purshaseCancleHandler}>
                      {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios) 
