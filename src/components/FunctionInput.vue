<template>
  <div v-if="value instanceof classes.triangle">
    <vs-input-number 
      v-model="value.lower"
      :max="value.mid"
      :min="-1000000"
      :color="color || 'primary'"/>
    <vs-input-number 
      v-model="value.mid"
      :min="value.lower"
      :max="value.upper"
      :color="color || 'primary'"/>
    <vs-input-number 
      v-model="value.upper"
      :min="value.mid"
      :color="color || 'primary'"/>
  </div>
  <div v-else-if="value instanceof classes.trapezium">
    <vs-input-number
      v-model="value.a"
      :max="value.b"
      :min="-100000"
      :color="color || 'primary'">
    </vs-input-number>

    <vs-input-number
      v-model="value.b"
      :min="value.a"
      :max="value.c"
      :color="color || 'primary'">
    </vs-input-number>
    
    <vs-input-number
      v-model="value.c"
      :min="value.b"
      :max="value.d"
      :color="color || 'primary'">
    </vs-input-number>
    
    <vs-input-number
      v-model="value.d"
      :min="value.b + 1"
      :color="color || 'primary'">
    </vs-input-number>
  </div>
  <div v-else-if="value instanceof classes.gauss">
    <vs-input 
      v-model="value.b"
      type="number"
      :min="-100000"
      :color="color || 'primary'"
      label-placeholder="Gauss B"
      size="large"
    />
    
    <vs-input 
      type="number"
      v-model="value.c"
      :color="color || 'primary'"
      label-placeholder="Gauss C"
      size="large"
    />
  </div>
  <div v-else-if="value instanceof classes.mult">
    <vs-input-number
      v-model="value.a1"
      :max="value.c1"
      :min="-100000"
      :color="color || 'primary'">
    </vs-input-number>

    <vs-input-number
      v-model="value.c1"
      :min="value.a1"
      :color="color || 'primary'">
    </vs-input-number>
    
    <vs-input-number
      v-model="value.a2"
      :min="-100000"
      :max="value.c2"
      :color="color || 'primary'">
    </vs-input-number>
    
    <vs-input-number
      v-model="value.c2"
      :min="value.a2"
      :color="color || 'primary'">
    </vs-input-number>
  </div>
</template>

<script>
import {
  GaussFunctionNumber,
  TrapeziumFunctionNumber,
  TwoFunctionsMult,
  TriangleNumber,
  FuzzyFunction
} from "@/classes";

export default {
  name: "function-input",
  props: {
    value: {
      type: FuzzyFunction,
      required: true
    },
    color: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      classes: {
        gauss: GaussFunctionNumber,
        trapezium: TrapeziumFunctionNumber,
        mult: TwoFunctionsMult,
        triangle: TriangleNumber
      }
    };
  }
};
</script>

<style>
</style>
