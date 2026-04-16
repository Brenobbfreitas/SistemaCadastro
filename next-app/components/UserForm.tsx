<form action={handleSubmit} className="flex flex-col gap-4">
                
                <Input 
                    label="Nome" 
                    name="name" 
                    type="text" 
                    placeholder="Seu nome completo" 
                    required 
                />

                <Input 
                    label="E-mail" 
                    name="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    required 
                />

                <Input 
                    label="Senha" 
                    name="password" 
                    type="password" 
                    placeholder="********" 
                    required 
                />

                {/* 🧹 NOVO CAMPO ADICIONADO AQUI 🧹 */}
                <Input 
                    label="Confirmar Senha" 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="********" 
                    required 
                />
                
                {/* Mensagem de Erro do Servidor (ex: Senhas não coincidem) */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded text-center">
                        ⚠️ {error}
                    </div>
                )}

                <Button type="submit" variant="primary" isLoading={loading}>
                    Cadastrar
                </Button>

            </form>