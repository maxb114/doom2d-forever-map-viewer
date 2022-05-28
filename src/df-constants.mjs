import { binaryIsBitSet } from './utility.mjs'

const specialItemToJSON = (/** @type {string} */ e) => {
  const frame = {
    name: '',
    resource: '',
    width: 0,
    height: 0,
    count: 0,
    backAnimation: ''
  }
  if (e === 'FRAMES_ITEM_BLUESPHERE') {
    frame.name = 'FRAMES_ITEM_BLUESPHERE'
    frame.resource = 'Game.wad:TEXTURES\\SBLUE'
    frame.width = 32
    frame.height = 32
    frame.count = 4
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_WHITESPHERE') {
    frame.name = 'FRAMES_ITEM_WHITESPHERE'
    frame.resource = 'Game.wad:TEXTURES\\SWHITE'
    frame.width = 32
    frame.height = 32
    frame.count = 4
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_ARMORGREEN') {
    frame.name = 'FRAMES_ITEM_ARMORGREEN'
    frame.resource = 'Game.wad:TEXTURES\\ARMORGREEN'
    frame.width = 32
    frame.height = 16
    frame.count = 3
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_ARMORBLUE') {
    frame.name = 'FRAMES_ITEM_ARMORBLUE'
    frame.resource = 'Game.wad:TEXTURES\\ARMORBLUE'
    frame.width = 32
    frame.height = 16
    frame.count = 3
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_JETPACK') {
    frame.name = 'FRAMES_ITEM_JETPACK'
    frame.resource = 'Game.wad:TEXTURES\\JETPACK'
    frame.width = 32
    frame.height = 32
    frame.count = 3
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_INVUL') {
    frame.name = 'FRAMES_ITEM_INVUL'
    frame.resource = 'Game.wad:TEXTURES\\INVUL'
    frame.width = 32
    frame.height = 32
    frame.count = 4
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_INVIS') {
    frame.name = 'FRAMES_ITEM_INVIS'
    frame.resource = 'Game.wad:TEXTURES\\INVIS'
    frame.width = 32
    frame.height = 32
    frame.count = 4
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_RESPAWN') {
    frame.name = 'FRAMES_ITEM_RESPAWN'
    frame.resource = 'Game.wad:TEXTURES\\ITEMRESPAWN'
    frame.width = 32
    frame.height = 32
    frame.count = 5
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_BOTTLE') {
    frame.name = 'FRAMES_ITEM_BOTTLE'
    frame.resource = 'Game.wad:TEXTURES\\BOTTLE'
    frame.width = 16
    frame.height = 32
    frame.count = 4
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_ITEM_HELMET') {
    frame.name = 'FRAMES_ITEM_HELMET'
    frame.resource = 'Game.wad:TEXTURES\\HELMET'
    frame.width = 16
    frame.height = 16
    frame.count = 4
    frame.backAnimation = 'True'
  } else if (e === 'FRAMES_MONSTER_BARREL_SLEEP') {
    frame.name = 'FRAMES_MONSTER_BARREL_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\BARREL_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_BARREL_DIE') {
    frame.name = 'FRAMES_MONSTER_BARREL_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\BARREL_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_BARREL_PAIN') {
    frame.name = 'FRAMES_MONSTER_BARREL_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\BARREL_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_ZOMBY_SLEEP') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_ZOMBY_GO') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_GO'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_ZOMBY_DIE') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_ZOMBY_MESS') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_MESS'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_MESS'
    frame.width = 64
    frame.height = 64
    frame.count = 9
  } else if (e === 'FRAMES_MONSTER_ZOMBY_ATTACK') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_ZOMBY_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_ATTACK_L'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_ZOMBY_PAIN') {
    frame.name = 'FRAMES_MONSTER_ZOMBY_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\ZOMBY_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SERG_SLEEP') {
    frame.name = 'FRAMES_MONSTER_SERG_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SERG_GO') {
    frame.name = 'FRAMES_MONSTER_SERG_GO'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_SERG_DIE') {
    frame.name = 'FRAMES_MONSTER_SERG_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 5
  } else if (e === 'FRAMES_MONSTER_SERG_MESS') {
    frame.name = 'FRAMES_MONSTER_SERG_MESS'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_MESS'
    frame.width = 64
    frame.height = 64
    frame.count = 9
  } else if (e === 'FRAMES_MONSTER_SERG_ATTACK') {
    frame.name = 'FRAMES_MONSTER_SERG_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SERG_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_SERG_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_ATTACK_L'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SERG_PAIN') {
    frame.name = 'FRAMES_MONSTER_SERG_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\SERG_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_MAN_SLEEP') {
    frame.name = 'FRAMES_MONSTER_MAN_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\MAN_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_MAN_GO') {
    frame.name = 'FRAMES_MONSTER_MAN_GO'
    frame.resource = 'Game.wad:MTEXTURES\\MAN_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_MAN_DIE') {
    frame.name = 'FRAMES_MONSTER_MAN_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\MAN_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_MAN_MESS') {
    frame.name = 'FRAMES_MONSTER_MAN_MESS'
    frame.resource = 'Game.wad:MTEXTURES\\MAN_MESS'
    frame.width = 64
    frame.height = 64
    frame.count = 9
  } else if (e === 'FRAMES_MONSTER_MAN_ATTACK') {
    frame.name = 'FRAMES_MONSTER_MAN_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\MAN_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_MAN_PAIN') {
    frame.name = 'FRAMES_MONSTER_MAN_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\MAN_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CGUN_SLEEP') {
    frame.name = 'FRAMES_MONSTER_CGUN_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CGUN_SLEEP_L') {
    frame.name = 'FRAMES_MONSTER_CGUN_SLEEP_L'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_SLEEP_L'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CGUN_GO') {
    frame.name = 'FRAMES_MONSTER_CGUN_GO'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_CGUN_GO_L') {
    frame.name = 'FRAMES_MONSTER_CGUN_GO_L'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_GO_L'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_CGUN_DIE') {
    frame.name = 'FRAMES_MONSTER_CGUN_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_CGUN_MESS') {
    frame.name = 'FRAMES_MONSTER_CGUN_MESS'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_MESS'
    frame.width = 64
    frame.height = 64
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_CGUN_ATTACK') {
    frame.name = 'FRAMES_MONSTER_CGUN_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CGUN_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_CGUN_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_ATTACK_L'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CGUN_PAIN') {
    frame.name = 'FRAMES_MONSTER_CGUN_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CGUN_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_CGUN_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\CGUN_PAIN_L'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_IMP_SLEEP') {
    frame.name = 'FRAMES_MONSTER_IMP_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\IMP_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_IMP_GO') {
    frame.name = 'FRAMES_MONSTER_IMP_GO'
    frame.resource = 'Game.wad:MTEXTURES\\IMP_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_IMP_DIE') {
    frame.name = 'FRAMES_MONSTER_IMP_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\IMP_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 5
  } else if (e === 'FRAMES_MONSTER_IMP_MESS') {
    frame.name = 'FRAMES_MONSTER_IMP_MESS'
    frame.resource = 'Game.wad:MTEXTURES\\IMP_MESS'
    frame.width = 64
    frame.height = 64
    frame.count = 8
  } else if (e === 'FRAMES_MONSTER_IMP_ATTACK') {
    frame.name = 'FRAMES_MONSTER_IMP_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\IMP_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_IMP_PAIN') {
    frame.name = 'FRAMES_MONSTER_IMP_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\IMP_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_DEMON_SLEEP') {
    frame.name = 'FRAMES_MONSTER_DEMON_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\DEMON_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_DEMON_GO') {
    frame.name = 'FRAMES_MONSTER_DEMON_GO'
    frame.resource = 'Game.wad:MTEXTURES\\DEMON_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_DEMON_DIE') {
    frame.name = 'FRAMES_MONSTER_DEMON_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\DEMON_DIE'
    frame.width = 64
    frame.height = 64
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_DEMON_ATTACK') {
    frame.name = 'FRAMES_MONSTER_DEMON_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\DEMON_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_DEMON_PAIN') {
    frame.name = 'FRAMES_MONSTER_DEMON_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\DEMON_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SOUL_SLEEP') {
    frame.name = 'FRAMES_MONSTER_SOUL_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\SOUL_SLEEP'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SOUL_GO') {
    frame.name = 'FRAMES_MONSTER_SOUL_GO'
    frame.resource = 'Game.wad:MTEXTURES\\SOUL_GO'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SOUL_PAIN') {
    frame.name = 'FRAMES_MONSTER_SOUL_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\SOUL_PAIN'
    frame.width = 64
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SOUL_ATTACK') {
    frame.name = 'FRAMES_MONSTER_SOUL_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\SOUL_ATTACK'
    frame.width = 64
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SOUL_DIE') {
    frame.name = 'FRAMES_MONSTER_SOUL_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\SOUL_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_FISH_SLEEP') {
    frame.name = 'FRAMES_MONSTER_FISH_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\FISH_SLEEP'
    frame.width = 32
    frame.height = 32
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_FISH_GO') {
    frame.name = 'FRAMES_MONSTER_FISH_GO'
    frame.resource = 'Game.wad:MTEXTURES\\FISH_GO'
    frame.width = 32
    frame.height = 32
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_FISH_PAIN') {
    frame.name = 'FRAMES_MONSTER_FISH_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\FISH_PAIN'
    frame.width = 32
    frame.height = 32
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_FISH_ATTACK') {
    frame.name = 'FRAMES_MONSTER_FISH_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\FISH_ATTACK'
    frame.width = 32
    frame.height = 32
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_FISH_DIE') {
    frame.name = 'FRAMES_MONSTER_FISH_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\FISH_DIE'
    frame.width = 32
    frame.height = 32
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SPIDER_SLEEP') {
    frame.name = 'FRAMES_MONSTER_SPIDER_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\SPIDER_SLEEP'
    frame.width = 256
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SPIDER_GO') {
    frame.name = 'FRAMES_MONSTER_SPIDER_GO'
    frame.resource = 'Game.wad:MTEXTURES\\SPIDER_GO'
    frame.width = 256
    frame.height = 128
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_SPIDER_PAIN') {
    frame.name = 'FRAMES_MONSTER_SPIDER_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\SPIDER_PAIN'
    frame.width = 256
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SPIDER_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_SPIDER_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\SPIDER_PAIN_L'
    frame.width = 256
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SPIDER_ATTACK') {
    frame.name = 'FRAMES_MONSTER_SPIDER_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\SPIDER_ATTACK'
    frame.width = 256
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SPIDER_DIE') {
    frame.name = 'FRAMES_MONSTER_SPIDER_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\SPIDER_DIE'
    frame.width = 256
    frame.height = 128
    frame.count = 0
  } else if (e === 'FRAMES_MONSTER_BSP_SLEEP') {
    frame.name = 'FRAMES_MONSTER_BSP_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\BSP_SLEEP'
    frame.width = 128
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_BSP_GO') {
    frame.name = 'FRAMES_MONSTER_BSP_GO'
    frame.resource = 'Game.wad:MTEXTURES\\BSP_GO'
    frame.width = 128
    frame.height = 64
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_BSP_PAIN') {
    frame.name = 'FRAMES_MONSTER_BSP_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\BSP_PAIN'
    frame.width = 128
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_BSP_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_BSP_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\BSP_PAIN_L'
    frame.width = 128
    frame.height = 64
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_BSP_ATTACK') {
    frame.name = 'FRAMES_MONSTER_BSP_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\BSP_ATTACK'
    frame.width = 128
    frame.height = 64
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_BSP_DIE') {
    frame.name = 'FRAMES_MONSTER_BSP_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\BSP_DIE'
    frame.width = 128
    frame.height = 64
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_CACO_SLEEP') {
    frame.name = 'FRAMES_MONSTER_CACO_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\CACO_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CACO_GO') {
    frame.name = 'FRAMES_MONSTER_CACO_GO'
    frame.resource = 'Game.wad:MTEXTURES\\CACO_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CACO_PAIN') {
    frame.name = 'FRAMES_MONSTER_CACO_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\CACO_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CACO_ATTACK') {
    frame.name = 'FRAMES_MONSTER_CACO_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\CACO_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_CACO_DIE') {
    frame.name = 'FRAMES_MONSTER_CACO_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\CACO_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_PAIN_SLEEP') {
    frame.name = 'FRAMES_MONSTER_PAIN_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\PAIN_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_PAIN_GO') {
    frame.name = 'FRAMES_MONSTER_PAIN_GO'
    frame.resource = 'Game.wad:MTEXTURES\\PAIN_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_PAIN_PAIN') {
    frame.name = 'FRAMES_MONSTER_PAIN_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\PAIN_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_PAIN_ATTACK') {
    frame.name = 'FRAMES_MONSTER_PAIN_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\PAIN_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_PAIN_DIE') {
    frame.name = 'FRAMES_MONSTER_PAIN_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\PAIN_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_BARON_SLEEP') {
    frame.name = 'FRAMES_MONSTER_BARON_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_BARON_SLEEP_L') {
    frame.name = 'FRAMES_MONSTER_BARON_SLEEP_L'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_SLEEP_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_BARON_GO') {
    frame.name = 'FRAMES_MONSTER_BARON_GO'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_BARON_PAIN') {
    frame.name = 'FRAMES_MONSTER_BARON_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_BARON_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_BARON_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_PAIN_L'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_BARON_ATTACK') {
    frame.name = 'FRAMES_MONSTER_BARON_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_BARON_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_BARON_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_ATTACK_L'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_BARON_DIE') {
    frame.name = 'FRAMES_MONSTER_BARON_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\BARON_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_KNIGHT_SLEEP') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_KNIGHT_SLEEP_L') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_SLEEP_L'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_SLEEP_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_KNIGHT_GO') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_GO'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_KNIGHT_PAIN') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_KNIGHT_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_PAIN_L'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_KNIGHT_ATTACK') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_KNIGHT_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_ATTACK_L'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_KNIGHT_DIE') {
    frame.name = 'FRAMES_MONSTER_KNIGHT_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\KNIGHT_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 7
  } else if (e === 'FRAMES_MONSTER_MANCUB_SLEEP') {
    frame.name = 'FRAMES_MONSTER_MANCUB_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\MANCUB_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_MANCUB_GO') {
    frame.name = 'FRAMES_MONSTER_MANCUB_GO'
    frame.resource = 'Game.wad:MTEXTURES\\MANCUB_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_MANCUB_PAIN') {
    frame.name = 'FRAMES_MONSTER_MANCUB_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\MANCUB_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_MANCUB_ATTACK') {
    frame.name = 'FRAMES_MONSTER_MANCUB_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\MANCUB_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_MANCUB_DIE') {
    frame.name = 'FRAMES_MONSTER_MANCUB_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\MANCUB_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 0
  } else if (e === 'FRAMES_MONSTER_SKEL_SLEEP') {
    frame.name = 'FRAMES_MONSTER_SKEL_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SKEL_SLEEP_L') {
    frame.name = 'FRAMES_MONSTER_SKEL_SLEEP_L'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_SLEEP_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SKEL_GO') {
    frame.name = 'FRAMES_MONSTER_SKEL_GO'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_SKEL_PAIN') {
    frame.name = 'FRAMES_MONSTER_SKEL_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SKEL_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_SKEL_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_PAIN_L'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_SKEL_ATTACK') {
    frame.name = 'FRAMES_MONSTER_SKEL_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SKEL_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_SKEL_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_ATTACK_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SKEL_ATTACK2') {
    frame.name = 'FRAMES_MONSTER_SKEL_ATTACK2'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_ATTACK2'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SKEL_ATTACK2_L') {
    frame.name = 'FRAMES_MONSTER_SKEL_ATTACK2_L'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_ATTACK2_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_SKEL_DIE') {
    frame.name = 'FRAMES_MONSTER_SKEL_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\SKEL_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 5
  } else if (e === 'FRAMES_MONSTER_VILE_SLEEP') {
    frame.name = 'FRAMES_MONSTER_VILE_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_VILE_SLEEP_L') {
    frame.name = 'FRAMES_MONSTER_VILE_SLEEP_L'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_SLEEP_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_VILE_GO') {
    frame.name = 'FRAMES_MONSTER_VILE_GO'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 6
  } else if (e === 'FRAMES_MONSTER_VILE_PAIN') {
    frame.name = 'FRAMES_MONSTER_VILE_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_VILE_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_VILE_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_PAIN_L'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_VILE_ATTACK') {
    frame.name = 'FRAMES_MONSTER_VILE_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 0
  } else if (e === 'FRAMES_MONSTER_VILE_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_VILE_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_ATTACK_L'
    frame.width = 128
    frame.height = 128
    frame.count = 0
  } else if (e === 'FRAMES_MONSTER_VILE_ATTACK2') {
    frame.name = 'FRAMES_MONSTER_VILE_ATTACK2'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_ATTACK2'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_VILE_ATTACK2_L') {
    frame.name = 'FRAMES_MONSTER_VILE_ATTACK2_L'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_ATTACK2_L'
    frame.width = 128
    frame.height = 128
    frame.count = 3
  } else if (e === 'FRAMES_MONSTER_VILE_DIE') {
    frame.name = 'FRAMES_MONSTER_VILE_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\VILE_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 9
  } else if (e === 'FRAMES_MONSTER_ROBO_SLEEP') {
    frame.name = 'FRAMES_MONSTER_ROBO_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\ROBO_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_ROBO_GO') {
    frame.name = 'FRAMES_MONSTER_ROBO_GO'
    frame.resource = 'Game.wad:MTEXTURES\\ROBO_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_ROBO_ATTACK') {
    frame.name = 'FRAMES_MONSTER_ROBO_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\ROBO_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_ROBO_ATTACK2') {
    frame.name = 'FRAMES_MONSTER_ROBO_ATTACK2'
    frame.resource = 'Game.wad:MTEXTURES\\ROBO_ATTACK2'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_ROBO_DIE') {
    frame.name = 'FRAMES_MONSTER_ROBO_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\ROBO_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CYBER_SLEEP') {
    frame.name = 'FRAMES_MONSTER_CYBER_SLEEP'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_SLEEP'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CYBER_SLEEP_L') {
    frame.name = 'FRAMES_MONSTER_CYBER_SLEEP_L'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_SLEEP_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CYBER_GO') {
    frame.name = 'FRAMES_MONSTER_CYBER_GO'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_GO'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_CYBER_GO_L') {
    frame.name = 'FRAMES_MONSTER_CYBER_GO_L'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_GO_L'
    frame.width = 128
    frame.height = 128
    frame.count = 4
  } else if (e === 'FRAMES_MONSTER_CYBER_PAIN') {
    frame.name = 'FRAMES_MONSTER_CYBER_PAIN'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_PAIN'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CYBER_PAIN_L') {
    frame.name = 'FRAMES_MONSTER_CYBER_PAIN_L'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_PAIN_L'
    frame.width = 128
    frame.height = 128
    frame.count = 1
  } else if (e === 'FRAMES_MONSTER_CYBER_ATTACK') {
    frame.name = 'FRAMES_MONSTER_CYBER_ATTACK'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_ATTACK'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CYBER_ATTACK_L') {
    frame.name = 'FRAMES_MONSTER_CYBER_ATTACK_L'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_ATTACK_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CYBER_ATTACK2') {
    frame.name = 'FRAMES_MONSTER_CYBER_ATTACK2'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_ATTACK2'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CYBER_ATTACK2_L') {
    frame.name = 'FRAMES_MONSTER_CYBER_ATTACK2_L'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_ATTACK2_L'
    frame.width = 128
    frame.height = 128
    frame.count = 2
  } else if (e === 'FRAMES_MONSTER_CYBER_DIE') {
    frame.name = 'FRAMES_MONSTER_CYBER_DIE'
    frame.resource = 'Game.wad:MTEXTURES\\CYBER_DIE'
    frame.width = 128
    frame.height = 128
    frame.count = 9
  }

  return frame
}

const getMonsterSize = (/** @type {string} */ monster) => {
  const object = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    name: ''
  }
  if (monster === 'MONSTER_DEMON') {
    object.x = 7
    object.y = 8
    object.width = 50
    object.height = 52
    object.name = 'MONSTER_DEMON'
  } else if (monster === 'MONSTER_IMP') {
    object.x = 15
    object.y = 10
    object.width = 34
    object.height = 50
    object.name = 'MONSTER_IMP'
  } else if (monster === 'MONSTER_ZOMBY') {
    object.x = 15
    object.y = 8
    object.width = 34
    object.height = 52
    object.name = 'MONSTER_ZOMBY'
  } else if (monster === 'MONSTER_SERG') {
    object.x = 15
    object.y = 8
    object.width = 34
    object.height = 52
    object.name = 'MONSTER_SERG'
  } else if (monster === 'MONSTER_CYBER') {
    object.x = 24
    object.y = 9
    object.width = 80
    object.height = 110
    object.name = 'MONSTER_CYBER'
  } else if (monster === 'MONSTER_CGUN') {
    object.x = 15
    object.y = 4
    object.width = 34
    object.height = 56
    object.name = 'MONSTER_CGUN'
  } else if (monster === 'MONSTER_BARON') {
    object.x = 39
    object.y = 32
    object.width = 50
    object.height = 64
    object.name = 'MONSTER_BARON'
  } else if (monster === 'MONSTER_KNIGHT') {
    object.x = 39
    object.y = 32
    object.width = 50
    object.height = 64
    object.name = 'MONSTER_KNIGHT'
  } else if (monster === 'MONSTER_CACO') {
    object.x = 34
    object.y = 36
    object.width = 60
    object.height = 56
    object.name = 'MONSTER_CACO'
  } else if (monster === 'MONSTER_SOUL') {
    object.x = 16
    object.y = 14
    object.width = 32
    object.height = 36
    object.name = 'MONSTER_SOUL'
  } else if (monster === 'MONSTER_PAIN') {
    object.x = 34
    object.y = 36
    object.width = 60
    object.height = 56
    object.name = 'MONSTER_PAIN'
  } else if (monster === 'MONSTER_SPIDER') {
    object.x = 23
    object.y = 14
    object.width = 210
    object.height = 100
    object.name = 'MONSTER_SPIDER'
  } else if (monster === 'MONSTER_BSP') {
    object.x = 14
    object.y = 17
    object.width = 100
    object.height = 42
    object.name = 'MONSTER_BSP'
  } else if (monster === 'MONSTER_MANCUB') {
    object.x = 28
    object.y = 34
    object.width = 72
    object.height = 60
    object.name = 'MONSTER_MANCUB'
  } else if (monster === 'MONSTER_SKEL') {
    object.x = 30
    object.y = 28
    object.width = 68
    object.height = 72
    object.name = 'MONSTER_SKEL'
  } else if (monster === 'MONSTER_VILE') {
    object.x = 30
    object.y = 28
    object.width = 68
    object.height = 72
    object.name = 'MONSTER_VILE'
  } else if (monster === 'MONSTER_FISH') {
    object.x = 6
    object.y = 11
    object.width = 20
    object.height = 10
    object.name = 'MONSTER_FISH'
  } else if (monster === 'MONSTER_BARREL') {
    object.x = 20
    object.y = 13
    object.width = 24
    object.height = 36
    object.name = 'MONSTER_BARREL'
  } else if (monster === 'MONSTER_ROBO') {
    object.x = 30
    object.y = 26
    object.width = 68
    object.height = 76
    object.name = 'MONSTER_ROBO'
  } else if (monster === 'MONSTER_MAN') {
    object.x = 15
    object.y = 6
    object.width = 34
    object.height = 52
    object.name = 'MONSTER_MAN'
  }
  return object
}

const getMonsterDelta = (/** @type {string} */ monster) => {
  const object = {
    x: 0,
    y: 0,
    width: 0,
    name: ''
  }
  if (monster === 'MONSTER_DEMON') {
    object.x = 1
    object.y = 4
    object.width = 64
    object.name = 'MONSTER_DEMON'
  } else if (monster === 'MONSTER_IMP') {
    object.x = 8
    object.y = -4
    object.width = 64
    object.name = 'MONSTER_IMP'
  } else if (monster === 'MONSTER_ZOMBY') {
    object.x = 1
    object.y = -4
    object.width = 64
    object.name = 'MONSTER_ZOMBY'
  } else if (monster === 'MONSTER_SERG') {
    object.x = 0
    object.y = -4
    object.width = 64
    object.name = 'MONSTER_SERG'
  } else if (monster === 'MONSTER_CYBER') {
    object.x = 2
    object.y = -6
    object.width = 128
    object.name = 'MONSTER_CYBER'
  } else if (monster === 'MONSTER_CGUN') {
    object.x = -1
    object.y = -2
    object.width = 64
    object.name = 'MONSTER_CGUN'
  } else if (monster === 'MONSTER_BARON') {
    object.x = 4
    object.y = 0
    object.width = 128
    object.name = 'MONSTER_BARON'
  } else if (monster === 'MONSTER_KNIGHT') {
    object.x = 4
    object.y = 0
    object.width = 128
    object.name = 'MONSTER_KNIGHT'
  } else if (monster === 'MONSTER_CACO') {
    object.x = 0
    object.y = -4
    object.width = 128
    object.name = 'MONSTER_CACO'
  } else if (monster === 'MONSTER_SOUL') {
    object.x = 1
    object.y = -10
    object.width = 64
    object.name = 'MONSTER_SOUL'
  } else if (monster === 'MONSTER_PAIN') {
    object.x = -1
    object.y = -3
    object.width = 128
    object.name = 'MONSTER_PAIN'
  } else if (monster === 'MONSTER_SPIDER') {
    object.x = -4
    object.y = -4
    object.width = 256
    object.name = 'MONSTER_SPIDER'
  } else if (monster === 'MONSTER_BSP') {
    object.x = 0
    object.y = -1
    object.width = 128
    object.name = 'MONSTER_BSP'
  } else if (monster === 'MONSTER_MANCUB') {
    object.x = -2
    object.y = -7
    object.width = 128
    object.name = 'MONSTER_MANCUB'
  } else if (monster === 'MONSTER_SKEL') {
    object.x = -1
    object.y = 4
    object.width = 128
    object.name = 'MONSTER_SKEL'
  } else if (monster === 'MONSTER_VILE') {
    object.x = 5
    object.y = -21
    object.width = 128
    object.name = 'MONSTER_VILE'
  } else if (monster === 'MONSTER_FISH') {
    object.x = -1
    object.y = 0
    object.width = 32
    object.name = 'MONSTER_FISH'
  } else if (monster === 'MONSTER_BARREL') {
    object.x = 0
    object.y = -15
    object.width = 64
    object.name = 'MONSTER_BARREL'
  } else if (monster === 'MONSTER_ROBO') {
    object.x = -2
    object.y = -26
    object.width = 128
    object.name = 'MONSTER_ROBO'
  } else if (monster === 'MONSTER_MAN') {
    object.x = 0
    object.y = -6
    object.width = 64
    object.name = 'MONSTER_MAN'
  }
  return object
}

const convertSpecialItem = (/** @type {string} */ e) => {
  if (e === 'ITEM_ARMOR_GREEN') {
    return 'FRAMES_ITEM_ARMORGREEN'
  } else if (e === 'ITEM_ARMOR_BLUE') {
    return 'FRAMES_ITEM_ARMORBLUE'
  } else if (e === 'ITEM_JETPACK') {
    return 'FRAMES_ITEM_JETPACK'
  } else if (e === 'ITEM_SPHERE_BLUE') {
    return 'FRAMES_ITEM_BLUESPHERE'
  } else if (e === 'ITEM_SPHERE_WHITE') {
    return 'FRAMES_ITEM_WHITESPHERE'
  } else if (e === 'ITEM_INVUL') {
    return 'FRAMES_ITEM_INVUL'
  } else if (e === 'ITEM_INVIS') {
    return 'FRAMES_ITEM_INVIS'
  } else if (e === 'ITEM_BOTTLE') {
    return 'FRAMES_ITEM_BOTTLE'
  } else if (e === 'ITEM_HELMET') {
    return 'FRAMES_ITEM_HELMET'
  } else if (e === 'MONSTER_DEMON') return 'FRAMES_MONSTER_DEMON_SLEEP'
  else if (e === 'MONSTER_IMP') return 'FRAMES_MONSTER_IMP_SLEEP'
  else if (e === 'MONSTER_ZOMBY') return 'FRAMES_MONSTER_ZOMBY_SLEEP'
  else if (e === 'MONSTER_SERG') return 'FRAMES_MONSTER_SERG_SLEEP'
  else if (e === 'MONSTER_CYBER') return 'FRAMES_MONSTER_CYBER_SLEEP'
  else if (e === 'MONSTER_CGUN') return 'FRAMES_MONSTER_CGUN_SLEEP'
  else if (e === 'MONSTER_BARON') return 'FRAMES_MONSTER_BARON_SLEEP'
  else if (e === 'MONSTER_KNIGHT') return 'FRAMES_MONSTER_KNIGHT_SLEEP'
  else if (e === 'MONSTER_CACO') return 'FRAMES_MONSTER_CACO_SLEEP'
  else if (e === 'MONSTER_SOUL') return 'FRAMES_MONSTER_SOUL_SLEEP'
  else if (e === 'MONSTER_PAIN') return 'FRAMES_MONSTER_PAIN_SLEEP'
  else if (e === 'MONSTER_SPIDER') return 'RAMES_MONSTER_SPIDER_GO'
  else if (e === 'MONSTER_BSP') return 'FRAMES_MONSTER_BSP_SLEEP'
  else if (e === 'MONSTER_MANCUB') return 'FRAMES_MONSTER_MANCUB_SLEEP'
  else if (e === 'MONSTER_SKEL') return 'FRAMES_MONSTER_SKEL_SLEEP'
  else if (e === 'MONSTER_VILE') return 'FRAMES_MONSTER_VILE_SLEEP'
  else if (e === 'MONSTER_FISH') return 'FRAMES_MONSTER_FISH_SLEEP'
  else if (e === 'MONSTER_BARREL') return 'FRAMES_MONSTER_ZOMBY_SLEEP'
  else if (e === 'MONSTER_ROBO') return 'FRAMES_MONSTER_ROBO_SLEEP'
  else if (e === 'MONSTER_MAN') return 'FRAMES_MONSTER_MAN_SLEEP'
  else if (e === 'MONSTER_ZOMBIE') return 'FRAMES_MONSTER_ZOMBY_SLEEP'
  return null
}

const convertGameItems = (/** @type {string} */ e) => {
  if (e === 'ITEM_MEDKIT_SMALL') return 'Game.wad:TEXTURES\\MED1'
  else if (e === 'ITEM_MEDKIT_LARGE') return 'Game.wad:TEXTURES\\MED2'
  else if (e === 'ITEM_WEAPON_SAW') return 'Game.wad:TEXTURES\\SAW'
  else if (e === 'ITEM_WEAPON_PISTOL') return 'Game.wad:TEXTURES\\PISTOL'
  else if (e === 'ITEM_WEAPON_KASTET') return 'Game.wad:TEXTURES\\KASTET'
  else if (e === 'ITEM_WEAPON_SHOTGUN1') return 'Game.wad:TEXTURES\\SHOTGUN1'
  else if (e === 'ITEM_WEAPON_SHOTGUN2') return 'Game.wad:TEXTURES\\SHOTGUN2'
  else if (e === 'ITEM_WEAPON_CHAINGUN') return 'Game.wad:TEXTURES\\MGUN'
  else if (e === 'ITEM_WEAPON_ROCKETLAUNCHER') return 'Game.wad:TEXTURES\\RLAUNCHER'
  else if (e === 'ITEM_WEAPON_PLASMA') return 'Game.wad:TEXTURES\\PGUN'
  else if (e === 'ITEM_WEAPON_BFG') return 'Game.wad:TEXTURES\\BFG'
  else if (e === 'ITEM_WEAPON_SUPERPULEMET') return 'Game.wad:TEXTURES\\SPULEMET'
  else if (e === 'ITEM_WEAPON_FLAMETHROWER') return 'Game.wad:TEXTURES\\FLAMETHROWER'
  else if (e === 'ITEM_AMMO_BULLETS') return 'Game.wad:TEXTURES\\CLIP'
  else if (e === 'ITEM_AMMO_BULLETS_BOX') return 'Game.wad:TEXTURES\\AMMO'
  else if (e === 'ITEM_AMMO_SHELLS') return 'Game.wad:TEXTURES\\SHELL1'
  else if (e === 'ITEM_AMMO_SHELLS_BOX') return 'Game.wad:TEXTURES\\SHELL2'
  else if (e === 'ITEM_AMMO_ROCKET') return 'Game.wad:TEXTURES\\ROCKET'
  else if (e === 'ITEM_AMMO_ROCKET_BOX') return 'Game.wad:TEXTURES\\ROCKETS'
  else if (e === 'ITEM_AMMO_CELL') return 'Game.wad:TEXTURES\\CELL'
  else if (e === 'ITEM_AMMO_CELL_BIG') return 'Game.wad:TEXTURES\\CELL2'
  else if (e === 'ITEM_AMMO_FUELCAN') return 'Game.wad:TEXTURES\\FUELCAN'
  else if (e === 'ITEM_AMMO_BACKPACK') return 'Game.wad:TEXTURES\\BPACK'
  else if (e === 'ITEM_KEY_RED') return 'Game.wad:TEXTURES\\KEYR'
  else if (e === 'ITEM_KEY_GREEN') return 'Game.wad:TEXTURES\\KEYG'
  else if (e === 'ITEM_KEY_BLUE') return 'Game.wad:TEXTURES\\KEYB'
  else if (e === 'ITEM_OXYGEN') return 'Game.wad:TEXTURES\\OXYGEN'
  else if (e === 'ITEM_SUIT') return 'Game.wad:TEXTURES\\SUIT'
  else if (e === 'ITEM_WEAPON_KASTET') return 'Game.wad:TEXTURES\\KASTET'
  else if (e === 'ITEM_MEDKIT_BLACK') return 'Game.wad:TEXTURES\\BMED'
  return null
}

const getAreaSize = (/** @type {string} */ area) => {
  const object = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
  if (area === 'AREA_PLAYERPOINT1') {
    object.x = 15
    object.y = 12
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_PLAYERPOINT2') {
    object.x = 15
    object.y = 12
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_DMPOINT') {
    object.x = 15
    object.y = 12
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_REDFLAG') {
    object.x = 15
    object.y = 11
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_BLUEFLAG') {
    object.x = 15
    object.y = 11
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_DOMFLAG') {
    object.x = 15
    object.y = 11
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_REDTEAMPOINT') {
    object.x = 15
    object.y = 12
    object.width = 34
    object.height = 52
  } else if (area === 'AREA_BLUETEAMPOINT') {
    object.x = 15
    object.y = 12
    object.width = 34
    object.height = 52
  }
  return object
}

const areaToTexture = (/** @type {string} */ area) => {
  if (area === 'AREA_PLAYERPOINT1') {
    return 'editor.wad:TEXTURES\\P1POINT'
  } else if (area === 'AREA_PLAYERPOINT2') {
    return 'editor.wad:TEXTURES\\P2POINT'
  } else if (area === 'AREA_DMPOINT') {
    return 'editor.wad:TEXTURES\\DMPOINT'
  } else if (area === 'AREA_REDFLAG') {
    return 'game.wad:TEXTURES\\FLAGRED'
  } else if (area === 'AREA_BLUEFLAG') {
    return 'game.wad:TEXTURES\\FLAGBLUE'
  } else if (area === 'AREA_DOMFLAG') {
    return 'game.wad:TEXTURES\\FLAGDOM'
  } else if (area === 'AREA_REDTEAMPOINT') {
    return 'editor.wad:TEXTURES\\REDPOINT'
  } else if (area === 'AREA_BLUETEAMPOINT') {
    return 'editor.wad:TEXTURES\\BLUEPOINT'
  }
  return null
}

const binaryAreaToString = (/** @type {number | undefined} */ type) => {
  if (type === undefined || type === 0) return 'AREA_NONE'
  else if (type === 1) return 'AREA_PLAYERPOINT1'
  else if (type === 2) return 'AREA_PLAYERPOINT2'
  else if (type === 3) return 'AREA_DMPOINT'
  else if (type === 4) return 'AREA_REDFLAG'
  else if (type === 5) return 'AREA_BLUEFLAG'
  else if (type === 6) return 'AREA_DOMFLAG'
  else if (type === 7) return 'AREA_REDTEAMPOINT'
  else if (type === 8) return 'AREA_BLUETEAMPOINT'
  return 'AREA_NONE'
}

const binaryMonsterToString = (/** @type {number | undefined} */ type) => {
  if (type === 0 || type === undefined) return 'MONSTER_NONE'
  else if (type === 1) return 'MONSTER_DEMON'
  else if (type === 2) return 'MONSTER_IMP'
  else if (type === 3) return 'MONSTER_ZOMBY'
  else if (type === 4) return 'MONSTER_SERG'
  else if (type === 5) return 'MONSTER_CYBER'
  else if (type === 6) return 'MONSTER_CGUN'
  else if (type === 7) return 'MONSTER_BARON'
  else if (type === 8) return 'MONSTER_KNIGHT'
  else if (type === 9) return 'MONSTER_CACO'
  else if (type === 10) return 'MONSTER_SOUL'
  else if (type === 11) return 'MONSTER_PAIN'
  else if (type === 12) return 'MONSTER_SPIDER'
  else if (type === 13) return 'MONSTER_BSP'
  else if (type === 14) return 'MONSTER_MANCUB'
  else if (type === 15) return 'MONSTER_SKEL'
  else if (type === 16) return 'MONSTER_VILE'
  else if (type === 17) return 'MONSTER_FISH'
  else if (type === 18) return 'MONSTER_BARREL'
  else if (type === 19) return 'MONSTER_ROBO'
  else if (type === 20) return 'MONSTER_MAN'
  return 'MONSTER_NONE'
}

const binaryPanelTypeToString = (/** @type {number | undefined} */ type) => {
  if (type === 0) return 'PANEL_NONE'
  else if (type === 1) return 'PANEL_WALL'
  else if (type === 2) return 'PANEL_BACK'
  else if (type === 4) return 'PANEL_FORE'
  else if (type === 8) return 'PANEL_WATER'
  else if (type === 16) return 'PANEL_ACID1'
  else if (type === 32) return 'PANEL_ACID2'
  else if (type === 64) return 'PANEL_STEP'
  else if (type === 128) return 'PANEL_LIFTUP'
  else if (type === 256) return 'PANEL_LIFTDOWN'
  else if (type === 512) return 'PANEL_OPENDOOR'
  else if (type === 1024) return 'PANEL_CLOSEDOOR'
  else if (type === 2048) return 'PANEL_BLOCKMON'
  else if (type === 4096) return 'PANEL_LIFTLEFT'
  else if (type === 8192) return 'PANEL_LIFTRIGHT'
  return 'PANEL_NONE'
}

const binaryItemOptionsToString = (/** @type {number | undefined} */ options) => {
  const flags = []
  if (options === 0 || options === undefined) return 'ITEM_OPTION_NONE'
  if (binaryIsBitSet(options, 1)) flags.push('ITEM_OPTION_ONLYDM')
  if (binaryIsBitSet(options, 2)) flags.push('ITEM_OPTION_FALL')
  const test = flags.join('|')
  return test
}

const binaryPanelFlagToString = (/** @type {number | undefined} */ type) => {
  const flags = []
  if (type === 0 || type === undefined) return 'PANEL_FLAG_NONE'
  if (binaryIsBitSet(type, 1)) flags.push('PANEL_FLAG_BLENDING')
  if (binaryIsBitSet(type, 2)) flags.push('PANEL_FLAG_HIDE')
  if (binaryIsBitSet(type, 4)) flags.push('PANEL_FLAG_WATERTEXTURES')
  return flags.join('|')
}

const binaryItemTypeToString = (/** @type {number | undefined} */ type) => {
  if (type === 0) return 'ITEM_NONE'
  else if (type === 1) return 'ITEM_MEDKIT_SMALL'
  else if (type === 2) return 'ITEM_MEDKIT_LARGE'
  else if (type === 3) return 'ITEM_MEDKIT_BLACK'
  else if (type === 4) return 'ITEM_ARMOR_GREEN'
  else if (type === 5) return 'ITEM_ARMOR_BLUE'
  else if (type === 6) return 'ITEM_SPHERE_BLUE'
  else if (type === 7) return 'ITEM_SPHERE_WHITE'
  else if (type === 8) return 'ITEM_SUIT'
  else if (type === 9) return 'ITEM_OXYGEN'
  else if (type === 10) return 'ITEM_INVUL'
  else if (type === 11) return 'ITEM_WEAPON_SAW'
  else if (type === 12) return 'ITEM_WEAPON_SHOTGUN1'
  else if (type === 13) return 'ITEM_WEAPON_SHOTGUN2'
  else if (type === 14) return 'ITEM_WEAPON_CHAINGUN'
  else if (type === 15) return 'ITEM_WEAPON_ROCKETLAUNCHER'
  else if (type === 16) return 'ITEM_WEAPON_PLASMA'
  else if (type === 17) return 'ITEM_WEAPON_BFG'
  else if (type === 18) return 'ITEM_WEAPON_SUPERPULEMET'
  else if (type === 19) return 'ITEM_AMMO_BULLETS'
  else if (type === 20) return 'ITEM_AMMO_BULLETS_BOX'
  else if (type === 21) return 'ITEM_AMMO_SHELLS'
  else if (type === 22) return 'ITEM_AMMO_SHELLS_BOX'
  else if (type === 23) return 'ITEM_AMMO_ROCKET'
  else if (type === 24) return 'ITEM_AMMO_ROCKET_BOX'
  else if (type === 25) return 'ITEM_AMMO_CELL'
  else if (type === 26) return 'ITEM_AMMO_CELL_BIG'
  else if (type === 27) return 'ITEM_AMMO_BACKPACK'
  else if (type === 28) return 'ITEM_KEY_RED'
  else if (type === 29) return 'ITEM_KEY_GREEN'
  else if (type === 30) return 'ITEM_KEY_BLUE'
  else if (type === 31) return 'ITEM_WEAPON_KASTET'
  else if (type === 32) return 'ITEM_WEAPON_PISTOL'
  else if (type === 33) return 'ITEM_BOTTLE'
  else if (type === 34) return 'ITEM_HELMET'
  else if (type === 35) return 'ITEM_JETPACK'
  else if (type === 36) return 'ITEM_INVIS'
  else if (type === 37) return 'ITEM_WEAPON_FLAMETHROWER'
  else if (type === 38) return 'ITEM_AMMO_FUELCAN'
  return 'ITEM_NONE'
}

export { binaryMonsterToString, binaryAreaToString, binaryItemOptionsToString, binaryItemTypeToString, binaryPanelTypeToString, binaryPanelFlagToString, specialItemToJSON, getMonsterSize, getMonsterDelta, convertSpecialItem, convertGameItems, getAreaSize, areaToTexture }
