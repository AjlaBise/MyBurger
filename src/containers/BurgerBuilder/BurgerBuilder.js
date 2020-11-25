import React, { Component } from 'react';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES={
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon:0.7
}

class BurgerBuilder extends Component {

    // constructor(props) {
    //     super(props)
    //     this.state = {


    //     }
    // }
    state = {

        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable : false,
        purchasing: false
    }

    updatePurchaseState (ingredients) {

        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({purchaseable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCounted = oldCount +1;
        const updateIngredients = {
             ...this.state.ingredients
        };
        updateIngredients[type] = updateCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice= this.state.totalPrice;
        const newPrice= oldPrice+priceAddition;
        this.setState({totalPrice: newPrice, ingredients:updateIngredients});
        this.updatePurchaseState(updateIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0)
        {
            return;
        }
        const updateCounted = oldCount - 1;
        const updateIngredients = {
             ...this.state.ingredients
        };
        updateIngredients[type] = updateCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice= this.state.totalPrice;
        const newPrice= oldPrice- priceAddition;
        this.setState({totalPrice: newPrice, ingredients:updateIngredients});
        this.updatePurchaseState(updateIngredients);

    }
    purshaseHandler = () => {
        this.setState({purchasing:true})
    }
    purshaseCancleHandler = () => {
        this.setState({purchasing:false})
    }

    render() {
      
        const disableInfo = {
            ...this.state.ingredients
        };

        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        return (
            <Aux>   
                <Modal show={this.state.purchasing} modelClosed={this.purshaseCancleHandler}>
                <OrderSummary ingredients={this.state.ingredients} />
                </Modal>
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
    }
}

export default BurgerBuilder
