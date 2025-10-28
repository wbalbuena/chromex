const words = {
    you: "https://youtube.com"
};

const imageUrl = chrome.runtime.getURL("mag-glass.png");

function highlightText(element) {
  // If we weren't provided an element, we don't need to render anything.
  if (!element) {
    return;
  }

  Object.keys(words).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');

    // Find all text nodes that haven't been processed yet
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip if parent already has our marker class
          if (node.parentNode.closest('.hyperlink-processed')) {
            return NodeFilter.FILTER_REJECT;8
          }
          // does text in node match regex
          return regex.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      },
      false
    );


    // push nodes processed by walker into a list
    const nodesToProcess = [];
    let node;
    while (node = walker.nextNode()) {
      nodesToProcess.push(node);
    }

    // for each nodeToProcess wrap text in a span called "hyperlink-processed" and replace node with new span element
    nodesToProcess.forEach(textNode => {
      const span = document.createElement('span');
      span.className = 'hyperlink-processed';
      span.innerHTML = textNode.textContent.replace(regex, (match) => {
        return `<a href="${words[word]}" style="color: blue; text-decoration: underline;">${match}<img src='${imageUrl}' style="height:12px;width:12px;"></a>`;
      });
      textNode.parentNode.replaceChild(span, textNode);
    });
  });
}

// Initial highlight
highlightText(document.body);

// Check for new content every 500ms (adjust as needed)
setInterval(() => {
  highlightText(document.body);
}, 500);

console.log("Dynamic hyperlink extension loaded");