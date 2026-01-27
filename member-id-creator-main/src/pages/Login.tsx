
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";


export default function Login() {
  const { login } = useAuth();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 const handleSubmit = async (e) => {
  e.preventDefault(); // 🔥 ESSENCIAL

  setIsLoading(true);
  setError("");

  try {
    const res = await loginUser(email, password);

 // 🔴 GARANTE persistência ANTES de qualquer redirect
localStorage.setItem("token", res.token);
localStorage.setItem("user", JSON.stringify(res.user));

// agora sim atualiza o contexto
login({ token: res.token, role: res.user.role });

// 🔴 SÓ DEPOIS navega
if (res.user.role === "admin") {
  navigate("/admin");
} else {
  navigate("/member");
}

  } catch (err) {
    console.error("Erro no login:", err);

    if (err.response?.data?.error) {
      // 🔥 mensagem que vem do backend
      setError(err.response.data.error);
    } else {
      setError("Erro ao conectar com o servidor");
    }
  } finally {
    setIsLoading(false);
  }
};


return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9}}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
            <p className="text-muted-foreground mt-2">
              Acesse sua carteirinha digital
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
           {error && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
  >
    <p className="text-sm text-destructive text-center">{error}</p>
  </motion.div>
)}


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Register Link */}
          <Link to="/register">
            <Button variant="outline" className="w-full" size="lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Criar nova conta
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Carteirinha Digital de Membros
        </p>
      </motion.div>
    </div>
  );
}
