import Cards from "./Cards";
import Slide1 from "../Images/Slide1.jpg"
import Slide2 from "../Images/Slide2.jpg"
import Slide3 from "../Images/Slide3.jpg"
import PizzaMain from "../Images/PizzaMain.png"

const Home = () => {
    const homeData = [
        {
            heading: "Hassle Free Service",
            para: "Take the hassle out of dinner planning with our pizza delivery service! Enjoy your favorite toppings delivered right to your doorstep. Order now and savor the convenience. 🍕🛵",
        },
        {
            heading: "Serve Your Cravings",
            para: "Craving a delicious slice of pizza but too busy to leave home? 🍕 Our pizza delivery service has got you covered! Order now and enjoy hot, fresh pizza delivered straight to your door.",
        },
        {
            heading: "No Stress",
            para: "No need to stress about what's for dinner tonight - let our pizza delivery service take care of it for you! 🚗🍕 Order online and enjoy the convenience of easy and delicious pizza delivery.",
        },
    ]
    return (
        <>
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="5000">
                        <img src={Slide1} className="d-block w-100" alt="Awesome Pizza" style={{ maxHeight: "500px", overflow: "hidden", objectFit: "cover" }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>{homeData[0].heading}</h5>
                            <p>{homeData[0].para}</p>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="5000">
                        <img src={Slide2} className="d-block w-100" alt="Awesome Pizza" style={{ maxHeight: "500px", overflow: "hidden", objectFit: "cover" }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>{homeData[1].heading}</h5>
                            <p>{homeData[1].para}</p>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="5000">
                        <img src={Slide3} className="d-block w-100" alt="Awesome Pizza" style={{ maxHeight: "500px", overflow: "hidden", objectFit: "cover" }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>{homeData[2].heading}</h5>
                            <p>{homeData[2].para}</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <h1 className='text-center font-heading' style={{ marginTop: "50px" }}>Welcome to the Best Pizza Delivery Service</h1><br />
            <section id="header" className="d-flex align-items-center">

                <div className="container-fluid">
                    <div className="row d-flex">
                        <div className="col-10 mx-auto">
                            <div className="row">
                                <div className="col-md-6 pt-1 pt-lg-0 order-2 order-lg-1 d-flex justify-content-center flex-column">
                                    <h2 className="m-5 font-heading">
                                        Indulge in the convenience of our swift and reliable pizza delivery service. Savor every bite without leaving the comfort of your home. 🏠🍕
                                    </h2>
                                </div>
                                <div className="col-lg-6 mt-md-5 mt-lg-5 order-1 order-lg-2 header-img">
                                    <img className="img-fluid" src={PizzaMain} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section><br /><br />
            <div className="d-flex justify-content-center align-items-center flex-wrap">
                {homeData.map((curr, index) => {
                    return <Cards key={index} heading={curr.heading} para={curr.para} />
                })}
            </div><br />

        </>
    )
}

export default Home;