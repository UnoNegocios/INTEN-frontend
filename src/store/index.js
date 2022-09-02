import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import item from "./modules/item"
import rejection from "./modules/rejection"
import quotation from "./modules/quotation"
import phase from "./modules/phase"
import origin from "./modules/origin"
import note from "./modules/note"
import log from "./modules/log"
import contact from "./modules/contact"
import company from "./modules/company"
import calendar from "./modules/calendar"
import activity from "./modules/activity"
import user from "./modules/user"
import status from "./modules/status"
import category from "./modules/category"
import pp from "./modules/pp"

import call from "./modules/call"
import type from "./modules/type"
import price_list from "./modules/price_list"
import zone from "./modules/zone"
import contact_mode from "./modules/contact_mode"
import special_condition from "./modules/special_condition"
import cfdi from "./modules/cfdi"
import payment_method from "./modules/payment_method"
import frequency from "./modules/frequency"

import conversation from "./modules/conversation"
import message from "./modules/message"
import message_status from "./modules/message_status"

import collection from "./modules/collection"
import shipping from "./modules/shipping"
import shipping_detail from "./modules/shipping_detail"
import expense from "./modules/expense"
import payroll from "./modules/payroll"

import shopping_detail from "./modules/shopping_detail"
import result from "./modules/result"
import production from "./modules/production"
import production_detail from "./modules/production_detail"
import supply from "./modules/supply"
import shopping from "./modules/shopping"
import provider_payment from "./modules/provider_payment"
import provider from "./modules/provider"
import vehicle from "./modules/vehicle"
import unit from "./modules/unit"

import expense_type from "./modules/expense_type"
import inventory from "./modules/inventory"

import carrito from "./modules/carrito"

import reports from "./modules/reports"

import cards from "./modules/cards"

import funnel from "./modules/funnel"
import lead from "./modules/lead"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {
  },
  actions: {
  },
  modules: {
    lead,
    funnel,
    cards,
    reports,
    carrito,
    inventory,
    expense_type,
    unit,
    provider,
    vehicle,
    shopping_detail,
    result,
    production,
    production_detail,
    supply,
    shopping,
    provider_payment,
    collection,
    shipping,
    shipping_detail,
    expense,
    payroll,
    conversation,
    message,
    message_status,
    frequency,
    payment_method,
    cfdi,
    special_condition,
    contact_mode,
    zone,
    price_list,
    type,
    call,
    currentUser,
    item,
    rejection,
    quotation,
    phase,
    origin,
    note,
    log,
    contact,
    company,
    calendar,
    activity,
    user,
    status,
    category,
    pp
  }
})
