var lowerPrice = document.getElementById("lowerPrice");
var upperPrice = document.getElementById("upperPrice");
var pageSize = document.getElementById("dealsQuantity");
var inputText = document.getElementById("searchInput");
var search = document.getElementById("searchButton");
var sortOption = document.getElementById("searchCategory");
var showWishlist = document.getElementById("showWishlist");
search.onclick = async function(event)
{
    var keyWord = inputText.value.toLowerCase();
    let url = "https://www.cheapshark.com/api/1.0/deals?"; // CheapShark API
    // Deals
    // Number of deals to show, if no number, will show all deals
    if(pageSize!==null && pageSize.value !== null && pageSize.value >0)
    {
        url+="&pageSize="+pageSize.value;
    }


    // Sort by (DealRating, Price, Title,Reviews, Recent) 
    // Default : dealRating
    // dealRating : CheapShark rates how goot a deal is based on several options
    // How new the game is, what size discount is offered, the steam rating, and how fresh the deal is.
    url+="&sortBy="+sortOption.value;
    
    if((lowerPrice!==null && upperPrice!==null) && (lowerPrice.value<upperPrice.value || lowerPrice.value==upperPrice.value))
    {
        //LowerPrice : Only returns deals with a price greater than this value
        url+="&lowerPrice="+lowerPrice.value;
        //UpperPrice : Only returns deals with a price less than or equal to this value
        url+="&upperPrice="+upperPrice.value;
    }
    
    
    //Title : looks for the string contained anywhere in the game name
    url+="&title="+keyWord;

    try{
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error : ${response.status}`);     
        }
        const data = await response.json();
        console.log(data); 
        displayDeals(data);
        
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }

    
}    



showWishlist.addEventListener('click', function (event) {
    const wishlistList = document.getElementById('wishlistList');
    if (wishlistList.style.display == "none")
    {
        renderWishlist();
        wishlistList.style.display = "block"
    }
    else
    {
        wishlistList.style.display = "none"
    }
});
function renderWishlist() {
    // Get the wishlist data from localStorage
    const wishlistDataString = localStorage.getItem('wishlist');

    console.log(wishlistDataString);
    // Parse the JSON string into a JavaScript array
    const wishlistData = JSON.parse(wishlistDataString) || [];

    // Get the wishlist container element
    const wishlistList = document.getElementById('wishlistList');

    
    // Clear existing wishlist items
    wishlistList.innerHTML = '';

    // Render each wishlist item
    wishlistData.forEach(game => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = game.link;
        link.textContent = game.title;
        listItem.appendChild(link);
        wishlistList.appendChild(listItem);
    });
}

function displayDeals(deals) {
    dealsTable.innerHTML = '';

        deals.forEach(deal => {
            const row = createDealRow(deal);
            dealsTable.appendChild(row);
        });
}


function createDealRow(deal) {
    const row = document.createElement('tr');

    // Game title
    const titleCell = document.createElement('td');
    titleCell.classList.add('deal-title');
    titleCell.textContent = deal.title;

    // Thumbnail 
    const thumbnailCell = document.createElement('td');
    thumbnailCell.classList.add('deal-thumbnail');
    const thumbnailImage = document.createElement('img');
    thumbnailImage.src = deal.thumb;
    thumbnailImage.alt = deal.title;
    thumbnailCell.appendChild(thumbnailImage);

    // Game price
    const priceCell = document.createElement('td');
    priceCell.classList.add('deal-price');
    priceCell.textContent = `$${deal.salePrice}`;

    if (deal.normalPrice && deal.normalPrice !== deal.salePrice) {
        
        // If normalPrice is present and different from salePrice
        const normalPriceElement = document.createElement('span');
        priceCell.innerHTML = `<del>$${deal.normalPrice}</del> <strong>$${deal.salePrice}</strong> (-${Math.floor((1-(deal.salePrice/deal.normalPrice))*100)}%)`;
        priceCell.appendChild(normalPriceElement);
    }

    // Steam rating
    const steamRateCell = document.createElement('td');
    steamRateCell.classList.add('deal-steam-rate');
    if(deal.steamRatingPercent !== 0 && deal.steamAppID !== null)
    {
        steamRateCell.textContent = deal.steamRatingPercent + "% of positive reviews";
    }
    else
    {
        steamRateCell.textContent = "No steam review data"
    }
    

    // Deal rating
    const dealRateCell = document.createElement('td');
    dealRateCell.classList.add('deal-deal-rate');
    dealRateCell.textContent = deal.dealRating;

    // Deal link
    const linkCell = document.createElement('td');
    const link = document.createElement('a');
    link.classList.add('deal-link');
    link.href = "https://www.cheapshark.com/redirect?dealID="+deal.dealID;
    link.target = '_blank';
    link.textContent = 'View Deal';
    linkCell.appendChild(link);

    // Add deal to wishlist
    const wishlistCell = document.createElement('td');
        wishlistCell.classList.add('deal-wishlist');

        const wishlistLink = document.createElement('a');
        wishlistLink.href = '#';
        wishlistLink.textContent = 'Add to Wishlist';
        wishlistLink.addEventListener('click', function (event) {
            addToWishlist(deal);
        });
        wishlistCell.appendChild(wishlistLink);

    // Remove from Wishlist
    const removeWishlistCell = document.createElement('td');
    removeWishlistCell.classList.add('deal-wishlist');

    const removeFromWishlistLink = document.createElement('a');
    removeFromWishlistLink.classList.add('wishlist-link');
    removeFromWishlistLink.href = '#';
    removeFromWishlistLink.textContent = 'Remove from Wishlist';
    removeFromWishlistLink.addEventListener('click', function (event) {
        removeFromWishlist(deal);
    });
    removeWishlistCell.appendChild(removeFromWishlistLink);

    row.appendChild(thumbnailCell);
    row.appendChild(titleCell);
    row.appendChild(priceCell);
    row.appendChild(steamRateCell);
    row.appendChild(dealRateCell);
    row.appendChild(linkCell);
    row.appendChild(wishlistCell);
    row.appendChild(removeWishlistCell);
    return row;
}

function addToWishlist(game) {
    // Get wishlist from localStorage or create an empty array
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Check if the game is already in the wishlist
    const isAlreadyInWishlist = wishlist.some(item => item.title === game.title);

    if (!isAlreadyInWishlist) {
        // Add the game to the wishlist
        wishlist.push({ title: game.title, link: "https://www.cheapshark.com/redirect?dealID="+game.dealID });
        // Update the localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Game added to wishlist!');
        renderWishlist();
    } else {
        alert('Game is already in the wishlist!');
    }
}

function removeFromWishlist(game) {
    // Retrieve existing wishlist from localStorage or create an empty array
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Find the index of the game in the wishlist
    const index = wishlist.findIndex(item => item.title === game.title);

    if (index !== -1) {
        // Remove the game from the wishlist
        wishlist.splice(index, 1);
        // Update the localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Game removed from wishlist!');
        // Re-render the wishlist
        renderWishlist();
    } else {
        alert('Game is not in the wishlist!');
    }
}


