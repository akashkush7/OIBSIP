import React from 'react'
import { ColorRing } from 'react-loader-spinner';

const SpinLoader = () => {
    return (
        <div className='popup'>
            <div className='loader'>
                <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['purple', 'purple', 'purple', 'purple', 'purple']}
                />
            </div>
        </div>
    )
}

export default SpinLoader