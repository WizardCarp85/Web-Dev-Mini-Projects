
document.addEventListener('DOMContentLoaded', function() {

    const contactButton = document.getElementById('contactButton');

    const linkedinURL = 'https://www.linkedin.com/in/yourusername/'; 

    if (contactButton) {
        contactButton.addEventListener('click', function() {
            
            window.open(linkedinURL, '_blank'); 

          
            console.log('Redirecting to LinkedIn:', linkedinURL);
        });
    }
});