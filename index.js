function TrieNode(key) {
  this.key = key;
  this.parent = null;
  this.children = {};
  this.end = false;
}

TrieNode.prototype.getWord = function () {
  var output = [];
  var node = this;
  while (node !== null) {
    output.unshift(node.key);
    node = node.parent;
  }
  return output.join("");
};

function Trie() {
  this.root = new TrieNode(null);
}


Trie.prototype.insert = function (word) {
  var node = this.root; 
  for (var i = 0; i < word.length; i++) {
    if (!node.children[word[i]]) {
      node.children[word[i]] = new TrieNode(word[i]);
      node.children[word[i]].parent = node;
    }
    node = node.children[word[i]];
    if (i == word.length - 1) {
      node.end = true;
    }
  }
};

Trie.prototype.contains = function (word) {
  var node = this.root;
  for (var i = 0; i < word.length; i++) {
    if (node.children[word[i]]) {
      node = node.children[word[i]];
    } else {
      return false;
    }
  }
  return node.end;
};

Trie.prototype.find = function (prefix) {
  var node = this.root;
  var output = [];
  for (var i = 0; i < prefix.length; i++) {
    if (node.children[prefix[i]]) {
      node = node.children[prefix[i]];
    } else {
      return output;
    }
  }
  findAllWords(node, output);
  return output;
};

function findAllWords(node, arr) {
  if (node.end) {
    arr.unshift(node.getWord());
  }
  for (var child in node.children) {
    findAllWords(node.children[child], arr);
  }
}
Trie.prototype.remove = function (word) {
  let root = this.root;
  if (!word) return;
  const removeWord = (node, word) => {
    if (node.end && node.getWord() === word) {
      let hasChildren = Object.keys(node.children).length > 0;
      if (hasChildren) {
        node.end = false;
      } else {
        node.parent.children = {};
      }
      return true;
    }
    for (let key in node.children) {
      removeWord(node.children[key], word);
    }
    return false;
  };
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
//function to search the priorities/todos
async function searchTodos() {
  var searchVal = document.getElementById("searchTodos").value.toUpperCase();
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
//function to remove the found items after search
function removeFound() {
  var tSomeStyleClasses = document.getElementsByClassName("found");
  while (tSomeStyleClasses.length > 0) {
    tSomeStyleClasses[0].classList.remove("found");
  }
}
