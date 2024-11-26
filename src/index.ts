// 역할 enum
enum Role {
  LIBRARIAN, // 사서
  MEMBER, // 멤버
}

// 유저 추상 클래스
abstract class User {
  constructor(public name: string, public age:number){}
  abstract getRole(): Role;
}

// 멤버 클래스
class Member extends User {
  constructor(name: string, age: number) {
    super(name,age);
  }
  getRole(): Role {
    return Role.MEMBER;
  }
}

// 사서 클래스
class Librarian extends User {
  constructor(name: string, age: number){
    super(name, age);
  }
  getRole(): Role {
    return Role.LIBRARIAN;
  }
}

// 책 클래스
class Book {
  constructor(
    public title: string,
    public author: string,
    public publishedDate: Date
  ) {}
}

// RentManager 인터페이스
interface RentManager {
  getBooks(): Book[];
  addBook(user: User, book: Book): void;
  removeBook(user: User, book: Book): void;
  rentBook(user: Member, book: Book): void;
  returnBook(user: Member, book: Book): void;
}

// Library 클래스
class Library implements RentManager {
  private books: Book[] = []; 
  private rentedBooks: Map<string, Book> = new Map<string, Book>(); // rentedBooks는 유저의 대여 이력 관리

  getBooks(): Book[] {
    // 깊은 복사를 하여 외부에서 books를 수정하는 것을 방지
    return JSON.parse(JSON.stringify(this.books));
  }

  addBook(user: User, book: Book): void {
    if (user.getRole() !== Role.LIBRARIAN) {
      console.log("사서만 도서를 추가할 수 있습니다.");
      return;
    }
    this.books.push(book);
  }

  removeBook(user: User, book: Book): void {
    if (user.getRole() !== Role.LIBRARIAN) {
      console.log("사서만 도서를 삭제할 수 있습니다.");
      return;
    }
    const index = this.books.indexOf(book);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  }

  rentBook(user: Member, book: Book): void {
    if (user.getRole() !== Role.MEMBER) {
      console.log("유저만 도서를 대여할 수 있습니다.");
      return;
    }
    if (this.rentedBooks.has(user.name)) {
      console.log(`${user.name}님은 이미 다른 책을 대여중이라 빌릴 수 없습니다.`);
    } else {
      this.rentedBooks.set(user.name, book);
      console.log(`${user.name}님이 [${book.title}] 책을 빌렸습니다.`);
    }
  }

  returnBook(user: Member, book: Book): void {
    if (user.getRole() !== Role.MEMBER) {
      console.log("유저만 도서를 반납할 수 있습니다.");
      return;
    }
    if (this.rentedBooks.get(user.name) === book) {
      this.rentedBooks.delete(user.name);
      console.log(`${user.name}님이 [${book.title}] 책을 반납했습니다.`);
    } else {
      console.log(`${user.name}님은 [${book.title}] 책을 빌린적이 없습니다.`);
    }
  }
}
/*--------------------------------------------------------------------------------------*/
function main() {
  const myLibrary = new Library();
  const librarian = new Librarian("Yoom", 32);
  const member1 = new Member("JJu", 33);
  const member2 = new Member("yooju", 33);

  const book = new Book("TS문법", "홍길동", new Date());
  const book2 = new Book("JS문법", "이순신", new Date());
  const book3 = new Book("CSS문법", "김두한", new Date());

  myLibrary.addBook(librarian, book);
  myLibrary.addBook(librarian, book2);
  myLibrary.addBook(librarian, book3);
  const books = myLibrary.getBooks();
  console.log("대여할 수 있는 도서 목록:", books);

  myLibrary.rentBook(member1, book);
  myLibrary.rentBook(member2, book2);

  myLibrary.returnBook(member1, book);
  myLibrary.returnBook(member2, book2);
}

main();