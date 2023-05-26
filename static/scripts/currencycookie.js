//See if currency override exists in URL in param _rchcur
if (new URLSearchParams(window.location.search).has('_rchcur')) {
    document.cookie = '_rchcur=' + new URLSearchParams(window.location.search).get('_rchcur');
}

//See if currency override exists in URL in param currency     
if (new URLSearchParams(window.location.search).has('currency')) {
    document.cookie = '_rchcur=' + new URLSearchParams(window.location.search).get('currency');
}