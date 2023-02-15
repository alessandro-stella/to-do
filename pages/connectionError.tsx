import Link from "next/link";

export default function ConnectionError() {
    return (
        <div>
            <div>Errore!</div>
            <div>
                C'è stato un errore durante la connessione al database, per
                favore riprova più tardi
            </div>
            <Link href="/">Torna alla home</Link>
        </div>
    );
}
