/** Utility to format number with tseps */
function formatNumber ( num ) {

    return num.toLocaleString( 'en-US', {
        maximumFractionDigits: 0
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
    const formatted = formatNumber( Number ( rawValue ) );
    inputField.value = formatted;

}

// Add event listener on DOM load
document.addEventListener( 'DOMContentLoaded', () => {

    const input = document.getElementById( 'input' );

    if ( input ) input.addEventListener( 'input', handleInput );

} );
