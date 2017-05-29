export default class DeepNetwork {
    constructor(layers) {
        if (layers.length !== 3) {
            throw new Error('Having more or less than 1 hidden layer is not yet supported.')
        }

        this.inputLayer = layers[0];

        this.hiddenLayer = layers[1];
        this.hiddenLayer.setInputLayer(this.inputLayer);

        this.outputLayer = layers[2];
        this.outputLayer.setInputLayer(this.hiddenLayer);
        this.hiddenLayer.setOutputLayer(this.outputLayer);
    }

    invoke(inputs) {
        // for (var i = 0, len = inputs.length; i < len; i++) {
        //     if (!isFinite(inputs[i])) {
        //         throw new Error('Neural network input is not a finite number.');
        //     }
        // }

        this.inputLayer.feedForward(inputs);
        this.hiddenLayer.feedForward();
        var outputs = this.outputLayer.feedForward();

        for (var i = 0, len = outputs.length; i < len; i++) {
            if (!isFinite(outputs[i])) {
                throw new Error('Neural network output is not a finite number.');
            }
        }

        return outputs;
    }

    learn(targetOutputs) {
        this.outputLayer.backPropagateCalculateErrorGradient(targetOutputs);
        this.hiddenLayer.backPropagateCalculateErrorGradient();
        this.outputLayer.backPropagateOptimize();
        this.hiddenLayer.backPropagateOptimize();
    }

    loadFromJson(json) {
        var weights = json.layers[1].weights;
        for (var i = 0; i < weights.length; i++) { //@TODO do this inside the layers
            this.hiddenLayer.weights[i] = weights[i];
        }
        weights = json.layers[2].weights;
        for (i = 0; i < weights.length; i++) { //@TODO do this inside the layers
            this.outputLayer.weights[i] = weights[i];
        }
    }

    saveToJson() {//@TODO use more future proof schema
        return {
            layers: [
                {},//placeholder for future input layer info
                {weights: Array.from(this.hiddenLayer.weights)},//@TODO do this inside the layers
                {weights: Array.from(this.outputLayer.weights)}//@TODO do this inside the layers
            ]
        }; //@TODO do this inside the layers
    }
}
