const MAX_NODE_LIMIT = 50;
const MAX_BRANCH_FACTOR = 5;
const MAX_DEPTH = 5;

//from the text corpus, procedurally generate a random mindmap specification
function generateTextSpecification(corpus){
    let count = 0;
    let depth = 0;
    let words = corpus.split('\n');

    let maxNodes = randInt(1, MAX_NODE_LIMIT);
    let maxDepth = randInt(1, MAX_DEPTH);

    let tree = randomWord();

    while(count <= maxNodes && depth <= maxDepth){
        add_nodes(tree);
    }

    return tree;

    function add_nodes(){
        //iterate through tree to get nodes of depth
        if(depth == 0){
            let bf = randInt(1, MAX_BRANCH_FACTOR);
            for(let i=0;i<bf;i++){
                tree = tree + '\n' + '\t'.repeat(depth+1) + randomWord();
            }
        }
        else{
            var re = new RegExp(`\\n\\t{${depth}}\\w+`, 'g');
            while ((match = re.exec(tree)) != null) {
                let bf = randInt(1, MAX_BRANCH_FACTOR);
                for(let i=0;i<bf;i++){
                    tree = tree.slice(0, re.lastIndex) + '\n' + '\t'.repeat(depth+1) + randomWord() + tree.slice(re.lastIndex, tree.length);
                    count += 1;
                }
            }
        }

        console.log(tree);
        depth += 1;
    }

    function randomWord() {
        return words[randInt(0, words.length-1)];
    }
}
