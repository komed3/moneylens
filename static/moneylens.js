/** Utility to format number with tseps */
function formatNumber ( num, max = 0, min = 0 ) {

    return Number ( num ).toLocaleString( 'en-US', {
        minimumFractionDigits: min,
        maximumFractionDigits: max
    } );

}

/** Animate a value from its last to the new given value */
function animateValue ( key, newValue, decimals = 0, duration = 600 ) {

    const el = document.querySelector( `[data-item="${key}"]` );

    if ( el ) {

        const startValue = parseFloat( el.dataset.value ) || 0;
        const startTime = performance.now();
        const diff = newValue - startValue;

        function update ( currentTime ) {

            const elapsed = currentTime - startTime;
            const progress = Math.min( elapsed / duration, 1 );
            const value = startValue + diff * progress;

            el.textContent = formatNumber( value, decimals, decimals );
            el.dataset.value = value;

            if ( progress < 1 ) {

                requestAnimationFrame( update );

            } else {

                el.dataset.value = newValue;
                el.textContent = formatNumber( newValue, decimals, decimals );

            }

        };

        requestAnimationFrame( update );

    }

}

/** Initialize displayed data values from JSON */
function insertDataValues ( dataObj ) {

    document.querySelectorAll( '[data-info]' ).forEach( el => {

        const key = el.getAttribute( 'data-info' );

        if ( key in dataObj ) el.textContent = formatNumber( dataObj[ key ], 2, 0 );

    } );

}

/** Sanitize and format input */
function handleInput ( e ) {

    const inputField = e.target;

    // Remove all non-digit characters
    let rawValue = inputField.value.replace( /[^\d]/g, '' );

    // Avoid leading zeros
    rawValue = rawValue.replace( /^0+/, '' );

    // If empty, do not proceed
    if ( ! rawValue ) {

        inputField.value = '';
        return;

    }

    // Format number with thousand separators
    const formatted = formatNumber( rawValue );
    inputField.value = formatted;

}

// Add event listener on DOM load
document.addEventListener( 'DOMContentLoaded', () => {

    fetch( './data.json' )
        .then( res => res.json() )
        .then( data => insertDataValues( data ) )
        .catch( err => console.error( 'Error loading JSON:', err ) );

    const input = document.getElementById( 'input' );

    if ( input ) input.addEventListener( 'input', handleInput );

} );
