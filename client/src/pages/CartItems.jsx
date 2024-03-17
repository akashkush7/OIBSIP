import React from 'react'

const CartItems = ({ item }) => {
    let ingredients = item['ingredients'];
    const entries = Object.entries(ingredients)

    console.log(Object.values(entries));
    return (
        <div className="card mx-5 my-4" style={{ color: "white", backgroundColor: "#F98866" }}>
            <img src="src/Images/Slide1.jpg" className="card-img-top" alt="Cart-Item" style={{ objectFit: "cover", height: "300px" }} />
            <div className="card-body">
                <h4 className="card-title">Custom Pizza</h4>
                <div className='d-flex justify-content-center mt-3'>
                    <table className='table'>
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Ingredient Type</th>
                                <th scope="col">Ingredients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((curr, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{curr[0]}</th>
                                        <td>{curr[1]}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CartItems