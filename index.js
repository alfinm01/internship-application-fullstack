// test name. Used to set a cookie to a value of 'a' or 'b'
const name = 'music-cookie'
// url where this should apply
const url = "https://cfw-takehome.developers.workers.dev/api/variants";


// don't edit below here
addEventListener("fetch", event => {
	if( event.request.url.indexOf(url) > -1 ){
		event.respondWith(fetchAndModify(event.request));
	}
});

async function fetchAndModify(request) {
	// 'a' or 'b', set below
	let group;

	// Send the request on to the origin server.
	const response = await fetch(request);

	// Determine which group this request is in.
	const cookie = request.headers.get('Cookie');

	// Get headers into a var to possibly change.
	const conditionalHeaders = new Headers(response.headers);

	// Read response body.
	const text = await response.text();

	if (cookie && cookie.includes(`${name}=a`)) {
		group = 'a';
	} else if (cookie && cookie.includes(`${name}=b`)) {
		group = 'b';
	} else {
		// 50/50 Split
		group = Math.random() < 0.5 ? 'a' : 'b';
		// The experiment was newly-assigned, so add a Set-Cookie header
		// to the response.
		conditionalHeaders.append('Set-Cookie', `${name}=${group}`);
	}

	return new Response(text, {
		status: response.status,
		statusText: response.statusText,
		headers: conditionalHeaders
	});

	var rewritter = new HTMLRewriter()
	  .on('a#url', {
	    element(element) {
	      if (element.hasAttribute("href")) {
	      	if (group === 'a') {
		        element.setAttribute("href", "https://www.youtube.com/watch?v=jgpJVI3tDbY")
	      	} else if (group === 'b') {
	      		element.setAttribute("href", "https://www.youtube.com/watch?v=sBFT_7kZ86Q")
	      	}
	      }
	      if (group === 'a') {
		      element.setInnerContent("Let's enjoy some classical, Monsieur!")
	      } else if (group === 'b') {
	      		element.setInnerContent("Because civilization, will never die...")
      	  }
	    }
	  })
	  .on('p#description', {
	    element(element) {
	    	if (group === 'a') {
		      element.setInnerContent("Bonjour, gentleman! You're destined to be a classical connoisseurs")
		    } else if (group === 'b') {
	      		element.setInnerContent("Hi, folks! You're a super special unique the one and only indie guy in the world")
	      	}
	    }
	  })
	  .on('title', {
	    element(element) {
	    	if (group === 'a') {
	      element.setInnerContent("Classical | Alfian Cloudflare Test")
	      } else if (group === 'b') {
	      		element.setInnerContent("Indie | Alfian Cloudflare Test")
	      	}
	    }
	  })
	  .on('h1#title', {
	    element(element) {
	      if (group === 'a') {
	        element.setInnerContent("Sir Classical")
	      } else if (group === 'b') {
	        element.setInnerContent("Aktifeast")
	      }
	    }
	  })

	  return rewritter.transform(newResponse)
}
