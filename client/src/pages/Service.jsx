import Ingredients from './IngredList'
import { useAuth } from '../store/auth'

const Service = () => {
    const { ingred, isLoggedIn } = useAuth();
    return (
        <> {isLoggedIn ?
            <>
                <div className='text-center' style={{ marginTop: '100px' }}>
                    <h1 className='font-heading'>Order Now</h1>
                    <p>Make Your own Pizza by choosing from the wide variety of ingredients available using following menu.</p>
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                    {ingred.map((curr) => {
                        return <Ingredients key={curr._id} name={curr.name} description={curr.description} price={curr.price} />
                    })}
                </div>
            </> : <h1 className='text-center font-heading' style={{ marginTop: "100px" }}>Please Login before using Our Services</h1>}
        </>
    )
}

export default Service