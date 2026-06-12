"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = "https://id-proyek-kamu.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
// Mengaktifkan koneksi ke database Supabase
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
