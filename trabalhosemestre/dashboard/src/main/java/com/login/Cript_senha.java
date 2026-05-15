package com.login;
import org.mindrot.jbcrypt.BCrypt;

public class Cript_senha {
	
	private static final int CUSTO = 12;
	
	//gerar hash
		public static String hash(String senha) {
			return BCrypt.hashpw(senha, BCrypt.gensalt(CUSTO));
		}
		
	//verificar senha = hash
		public static boolean verificar(String senha, String hash){
				return BCrypt.checkpw(senha, hash);

	}
}
