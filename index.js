function TrieNode(key) {
  // the "key" value will be the character in sequence
  this.key = key;

  // we keep a reference to parent
  this.parent = null;

  // we have hash of children
  this.children = {};

  // check to see if the node is at the end
  this.end = false;
}

// iterates through the parents to get the word.
// time complexity: O(k), k = word length
TrieNode.prototype.getWord = function () {
  var output = [];
  var node = this;

  while (node !== null) {
    output.unshift(node.key);
    node = node.parent;
  }

  return output.join("");
};

// -----------------------------------------

// we implement Trie with just a simple root with null value.
function Trie() {
  this.root = new TrieNode(null);
}

// inserts a word into the trie.
// time complexity: O(k), k = word length
Trie.prototype.insert = function (word) {
  var node = this.root; // we start at the root 😬

  // for every character in the word
  for (var i = 0; i < word.length; i++) {
    // check to see if character node exists in children.
    if (!node.children[word[i]]) {
      // if it doesn't exist, we then create it.
      node.children[word[i]] = new TrieNode(word[i]);

      // we also assign the parent to the child node.
      node.children[word[i]].parent = node;
    }

    // proceed to the next depth in the trie.
    node = node.children[word[i]];

    // finally, we check to see if it's the last word.
    if (i == word.length - 1) {
      // if it is, we set the end flag to true.
      node.end = true;
    }
  }
};

// check if it contains a whole word.
// time complexity: O(k), k = word length
Trie.prototype.contains = function (word) {
  var node = this.root;

  // for every character in the word
  for (var i = 0; i < word.length; i++) {
    // check to see if character node exists in children.
    if (node.children[word[i]]) {
      // if it exists, proceed to the next depth of the trie.
      node = node.children[word[i]];
    } else {
      // doesn't exist, return false since it's not a valid word.
      return false;
    }
  }

  // we finished going through all the words, but is it a whole word?
  return node.end;
};

// returns every word with given prefix
// time complexity: O(p + n), p = prefix length, n = number of child paths
Trie.prototype.find = function (prefix) {
  var node = this.root;
  var output = [];

  // for every character in the prefix
  for (var i = 0; i < prefix.length; i++) {
    // make sure prefix actually has words
    if (node.children[prefix[i]]) {
      node = node.children[prefix[i]];
    } else {
      // there's none. just return it.
      return output;
    }
  }

  // recursively find all words in the node
  findAllWords(node, output);

  return output;
};

// recursive function to find all words in the given node.
function findAllWords(node, arr) {
  // base case, if node is at a word, push to output
  if (node.end) {
    arr.unshift(node.getWord());
  }

  // iterate through each children, call recursive findAllWords
  for (var child in node.children) {
    findAllWords(node.children[child], arr);
  }
}
Trie.prototype.remove = function (word) {
  let root = this.root;
  if (!word) return;
  // recursively finds and removes a word
  const removeWord = (node, word) => {
    // check if current node contains the word
    if (node.end && node.getWord() === word) {
      // check and see if node has children
      let hasChildren = Object.keys(node.children).length > 0;
      // if has children we only want to un-flag the end node that marks end of a word.
      // this way we do not remove words that contain/include supplied word
      if (hasChildren) {
        node.end = false;
      } else {
        // remove word by getting parent and setting children to empty dictionary
        node.parent.children = {};
      }
      return true;
    }
    // recursively remove word from all children
    for (let key in node.children) {
      removeWord(node.children[key], word);
    }
    return false;
  };
  // call remove word on root node
  removeWord(root, word);
};

// instantiate our trie with samples
var trie = new Trie();
trie.insert("HIT THE GYM");
trie.insert("PAY BILLS");
trie.insert("MEET GEORGE");
trie.insert("READ A BOOK");

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function (e) {
    var div = this.parentElement;
    div.style.display = "none";
    console.log(div.innerText.substring(0, div.innerText.length - 1));
    trie.remove(div.innerText.substring(0, div.innerText.length - 1));
  };
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector("ol");
list.addEventListener(
  "click",
  function (ev) {
    if (ev.target.tagName === "LI") {
      ev.target.classList.toggle("checked");
    }
  },
  false
);

// Create a new list item when clicking on the "Add" button
async function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value.toUpperCase();
  trie.insert(inputValue);
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      var div = this.parentElement;
      div.style.display = "none";
      console.log(div.innerText.substring(0, div.innerText.length - 1));
      trie.remove(div.innerText.substring(0, div.innerText.length - 1));
    };
  }
}

async function searchTodos() {
  var searchVal = document.getElementById("searchTodos").value.toUpperCase();
  // console.log(trie.find(searchVal));
  // var node = document.getElementById("mySearch");
  // node.querySelectorAll("*").forEach((n) => n.remove());
  var arr = trie.find(searchVal);
  if (arr.length == 0) {
    alert("No matches found");
  } else {
    var list = document.getElementById("myUL").getElementsByTagName("li");
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (
          arr[i] == list[j].innerText.substring(0, list[j].innerText.length - 2)
        ) {
          list[j].classList.add("found");
        }
      }
    }
    setTimeout(removeFound, 5000);
  }
}

function removeFound() {
  var tSomeStyleClasses = document.getElementsByClassName("found");
  while (tSomeStyleClasses.length > 0) {
    tSomeStyleClasses[0].classList.remove("found");
  }
}
