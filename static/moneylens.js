/** Global data, loaded from JSON */
let data = {};

/** Debounce input calculation trigger */
let debounceTimeout = null;

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

    // If empty, set to "0"
    if ( ! rawValue ) rawValue = 0;

    // Format number with thousand separators
    const formatted = formatNumber( rawValue );
    inputField.value = formatted;

    calculate_metrics( rawValue );

}

/** Calculate metrics */
function calculate_metrics ( val ) {

    clearTimeout( debounceTimeout );

    debounceTimeout = setTimeout( () => {

        calc_metric__gold( val );
        calc_metric__coins( val );
        calc_metric__diamond( val );
        calc_metric__savings( val );
        calc_metric__expenses( val );
        calc_metric__burger( val );

    }, 300 );

}

/** Calculate gold weight and sphere diameter */
function calc_metric__gold ( val ) {

    const weight = val / data.gold_price;
    const volume = weight / 19.32;
    const diameter = 2 * Math.cbrt( ( 3 * volume ) / ( 4 * Math.PI ) );

    animateValue( '__gold_weight', weight, 3 );
    animateValue( '__gold_diameter', diameter, 3 );

}

/** Calculate number of US dollar coins and resulting physical dimensions */
function calc_metric__coins ( val ) {

    const weight = val * data.coin_weight / 1000;
    const height = val * data.coin_height / 100;
    const area = val * Math.PI * Math.pow( data.coin_diameter / 2, 2 ) * 2.4711e-8;

    animateValue( '__coins_weight', weight, 3 );
    animateValue( '__coins_hight', height, 3 );
    animateValue( '__coins_area', area, 3 );

}

/** Calculate the Diamond carat equivalent */
function calc_metric__diamond ( val ) {

    const carat = val / data.diamond_carat;

    animateValue( '__diamond_carat', carat, 3 );

}

/** Calculate the avg. US household savings and income equivalent */
function calc_metric__savings ( val ) {

    const savings = val / data.savings;
    const income = val / ( data.income / 12 );

    animateValue( '__household_savings', savings, 3 );
    animateValue( '__household_income', income, 3 );

}

/** Calculate living expenses in some countries */
function calc_metric__expenses ( val ) {

    const us = val / data.expenses_us;
    const de = val / data.expenses_de;
    const ch = val / data.expenses_ch;
    const india = val / data.expenses_in;
    const pk = val / data.expenses_pk;

    animateValue( '__expenses_us', us, 0 );
    animateValue( '__expenses_de', de, 0 );
    animateValue( '__expenses_ch', ch, 0 );
    animateValue( '__expenses_in', india, 0 );
    animateValue( '__expenses_pk', pk, 0 );

}

/** Calculate the number of burger */
function calc_metric__burger ( val ) {

    const burger = val / data.burger;

    animateValue( '__burger_amount', burger, 0 );

}

/** Add event listener on DOM load */
document.addEventListener( 'DOMContentLoaded', () => {

    fetch( './data.json' )
        .then( res => res.json() )
        .then( ( json ) => {
            data = json;
            insertDataValues( data );
        } )
        .catch( ( err ) => {
            console.error( 'Error loading JSON:', err )
        } );

    const input = document.getElementById( 'input' );

    if ( input ) input.addEventListener( 'input', handleInput );

} );
