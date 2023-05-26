<template>
  <component :is="modeComponent"></component>
</template>
<script>
import BlendMode from '~/components/svg/BlendMode'
import PulseMode from '~/components/svg/PulseMode'
import LockMode from '~/components/svg/LockMode'
import FlashingRed from '~/components/svg/FlashingRed'
import SolidRedLights from '~/components/svg/SolidRedLights'
import Globe from '~/components/svg/Globe'
import Lightning from '~/components/svg/Lightning'
import Lightning2 from '~/components/svg/Lightning2'
import Charge from '~/components/svg/Charge'
import Drop from '~/components/svg/Drop'
import Leaf from '~/components/svg/Leaf'
import Diamond from '~/components/svg/Diamond'
import Mountain from '~/components/svg/Mountain'
import Pocket from '~/components/svg/Pocket'
import Snowflake from '~/components/svg/Snowflake'
import Fabric from '~/components/svg/Fabric'
import Dressing from '~/components/svg/Dressing'
import Cafe from '~/components/svg/Cafe'
import Milkshake from '~/components/svg/Milkshake'
import HappyHour from '~/components/svg/HappyHour'
import Protein from '~/components/svg/Protein'
import Fruit from '~/components/svg/Fruit'
import DairyFree from '~/components/svg/DairyFree'
import EssentialOils from '~/components/svg/EssentialOils'
import GlutenFree from '~/components/svg/GlutenFree'
import NoArtificialIngredients from '~/components/svg/NoArtificialIngredients'
import NonGMO from '~/components/svg/NonGMO'
import NoPreservatives from '~/components/svg/NoPreservatives'
import NoTransFats from '~/components/svg/NoTransFats'
import NutFree from '~/components/svg/NutFree'
import Organic from '~/components/svg/Organic'
import Paleo from '~/components/svg/Paleo'
import Raw from '~/components/svg/Raw'
import RealFood from '~/components/svg/RealFood'
import SoyFree from '~/components/svg/SoyFree'
import SustainablePackaging from '~/components/svg/SustainablePackaging'
import Vegan from '~/components/svg/Vegan'
import Vegetarian from '~/components/svg/Vegetarian'
import CheckMark from '~/components/svg/CheckMark'
import NoArtificialSugar from '~/components/svg/NoArtificialSugar'

export default {
  props: {
    type: {
      type: String
    }
  },
  computed: {
    modeComponent() {
      let mode = 'BlendMode'
      switch (this.type) {
        case 'Blue': {
          mode = 'BlendMode'
          break
        }
        case 'Blue Flashing': {
          mode = 'PulseMode'
          break
        }
        case 'Purple': {
          mode = 'LockMode'
          break
        }
        case 'Red Flashing': {
          mode = 'FlashingRed'
          break
        }
        case 'Red': {
          mode = 'SolidRedLights'
          break
        }
        case 'Globe': {
          mode = 'Globe'
          break
        }
        case 'Lightning': {
          mode = 'Lightning'
          break
        }
        case 'Lightning2': {
          mode = 'Lightning2'
          break
        }
        case 'Charge': {
          mode = 'Charge'
          break
        }
        case 'Drop': {
          mode = 'Drop'
          break
        }
        case 'Leaf': {
          mode = 'Leaf'
          break
        }
        case 'Diamond': {
          mode = 'Diamond'
          break
        }
        case 'Mountain': {
          mode = 'Mountain'
          break
        }
        case 'Pocket': {
          mode = 'Pocket'
          break
        }
        case 'Snowflake': {
          mode = 'Snowflake'
          break
        }
        case 'Fabric': {
          mode = 'Fabric'
          break
        }
        case 'Dressing': {
          mode = 'Dressing'
          break
        }
        case 'Cafe': {
          mode = 'Cafe'
          break
        }
        case 'Milkshake': {
          mode = 'Milkshake'
          break
        }
        case 'Protein': {
          mode = 'Protein'
          break
        }
        case 'HappyHour': {
          mode = 'HappyHour'
          break
        }
        case 'Fruit': {
          mode = 'Fruit'
          break
        }
        case 'DairyFree': {
          mode = 'DairyFree'
          break
        }
        case 'EssentialOils': {
          mode = 'EssentialOils'
          break
        }
        case 'GlutenFree': {
          mode = 'GlutenFree'
          break
        }
        case 'NoArtificialIngredients': {
          mode = 'NoArtificialIngredients'
          break
        }
        case 'NonGMO': {
          mode = 'NonGMO'
          break
        }
        case 'NoPreservatives': {
          mode = 'NoPreservatives'
          break
        }
        case 'NoTransFats': {
          mode = 'NoTransFats'
          break
        }
        case 'NutFree': {
          mode = 'NutFree'
          break
        }
        case 'Organic': {
          mode = 'Organic'
          break
        }
        case 'Paleo': {
          mode = 'Paleo'
          break
        }
        case 'Raw': {
          mode = 'Raw'
          break
        }
        case 'RealFood': {
          mode = 'RealFood'
          break
        }
        case 'SoyFree': {
          mode = 'SoyFree'
          break
        }
        case 'SustainablePackaging': {
          mode = 'SustainablePackaging'
          break
        }
        case 'Vegan': {
          mode = 'Vegan'
          break
        }
        case 'Vegetarian': {
          mode = 'Vegetarian'
          break
        }
        case 'NoArtificialSugar': {
          mode = 'NoArtificialSugar'
          break
        }
        case 'CheckMark': {
          mode = 'CheckMark'
          break
        }
      }

      return mode
    }
  },
  components: {
    BlendMode,
    PulseMode,
    LockMode,
    FlashingRed,
    SolidRedLights,
    Globe,
    Lightning,
    Lightning2,
    Charge,
    Drop,
    Leaf,
    Diamond,
    Mountain,
    Pocket,
    Snowflake,
    Fabric,
    Dressing,
    Cafe,
    Milkshake,
    Protein,
    HappyHour,
    Fruit,
    DairyFree,
    EssentialOils,
    GlutenFree,
    NoArtificialIngredients,
    NonGMO,
    NoPreservatives,
    NoTransFats,
    NutFree,
    Organic,
    Paleo,
    Raw,
    RealFood,
    SoyFree,
    SustainablePackaging,
    Vegan,
    Vegetarian,
    NoArtificialSugar,
    CheckMark
  }
}
</script>
